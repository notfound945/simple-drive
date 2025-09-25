<script lang="ts">
  import { onMount } from 'svelte';
  import UploadIcon from '$lib/icons/Upload.svelte';
  import ImageIcon from '$lib/icons/Image.svelte';
  import TrashIcon from '$lib/icons/Trash.svelte';
  import DownloadIcon from '$lib/icons/Download.svelte';
  import FileIcon from '$lib/icons/File.svelte';
  import FileTextIcon from '$lib/icons/FileText.svelte';
  import FileVideoIcon from '$lib/icons/FileVideo.svelte';
  import FileAudioIcon from '$lib/icons/FileAudio.svelte';
  import FileArchiveIcon from '$lib/icons/FileArchive.svelte';
  import FileCodeIcon from '$lib/icons/FileCode.svelte';
  import FileJsonIcon from '$lib/icons/FileJson.svelte';
  import './+page.css';

  let selectedFiles: File[] = [];
  let uploading = false;
  let images: { filename: string; url: string; size: number; format: string; uploadTime: string }[] = [];
  let myUploads = new Set<string>();
  let activeTab: 'mine' | 'all' = 'all';
  let preview: { filename: string; url: string; format: string } | null = null;
  let errorMessage = '';
  let toasts: { id: number; type: 'success' | 'error'; text: string }[] = [];
  let sortBy: 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc' = 'time-desc';
  let layout: 'grid' | 'list' = 'grid';
  let confirmModal: { show: boolean; title: string; message: string; onConfirm: () => void } = {
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  };

  function saveMyUploads() {
    try {
      localStorage.setItem('myUploads', JSON.stringify(Array.from(myUploads)));
    } catch {}
  }

  function loadMyUploads() {
    try {
      const raw = localStorage.getItem('myUploads');
      if (raw) {
        const list: string[] = JSON.parse(raw);
        myUploads = new Set(list);
      }
    } catch {}
  }

  async function fetchImages() {
    try {
      const res = await fetch(`/api/images?sort=${sortBy}`);
      if (!res.ok) throw new Error('加载图片列表失败');
      images = await res.json();
      // prune removed files from myUploads
      const existing = new Set(images.map((i) => i.filename));
      let changed = false;
      for (const name of Array.from(myUploads)) {
        if (!existing.has(name)) {
          myUploads.delete(name);
          changed = true;
        }
      }
      if (changed) saveMyUploads();
    } catch (err) {
      errorMessage = (err as Error).message;
    }
  }

  onMount(() => {
    loadMyUploads();
    fetchImages();
    // listen for server-sent events and auto-refresh
    const es = new EventSource('/api/events');
    es.onmessage = (ev) => {
      if (ev.data === 'images') {
        fetchImages();
      }
    };
    return () => es.close();
  });

  async function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    selectedFiles = input.files ? Array.from(input.files) : [];
    if (selectedFiles.length > 0) {
      await uploadFiles();
      // reset input to allow re-selecting the same files again
      input.value = '';
    }
  }

  async function uploadFiles() {
    if (selectedFiles.length === 0) return;
    uploading = true;
    errorMessage = '';
    try {
      const form = new FormData();
      for (const f of selectedFiles) form.append('file', f);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || '上传失败');
      }
      // record uploaded names as "mine"
      try {
        const uploaded: { filename: string; url: string }[] = await res.json();
        for (const it of uploaded) myUploads.add(it.filename);
        saveMyUploads();
      } catch {}
      selectedFiles = [];
      await fetchImages();
      pushToast('success', '上传成功');
    } catch (err) {
      errorMessage = (err as Error).message;
      pushToast('error', errorMessage || '上传失败');
    } finally {
      uploading = false;
    }
  }

  function showConfirm(title: string, message: string, onConfirm: () => void) {
    confirmModal = { show: true, title, message, onConfirm };
  }

  function hideConfirm() {
    confirmModal.show = false;
  }

  function handleConfirm() {
    confirmModal.onConfirm();
    hideConfirm();
  }

  async function deleteImage(filename: string) {
    showConfirm(
      '确认删除',
      `确定要删除图片 "${filename}" 吗？此操作不可撤销。`,
      async () => {
        try {
          const res = await fetch(`/uploads/${encodeURIComponent(filename)}`, { method: 'DELETE' });
          if (!res.ok && res.status !== 204) throw new Error('删除失败');
          myUploads.delete(filename);
          saveMyUploads();
          await fetchImages();
        } catch (err) {
          errorMessage = (err as Error).message;
        }
      }
    );
  }

  $: visibleImages = activeTab === 'mine' ? images.filter((i) => myUploads.has(i.filename)) : images;
  
  // Reactive: refetch when sort changes
  $: if (sortBy) {
    fetchImages();
  }
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (confirmModal.show) {
        hideConfirm();
      } else {
        preview = null;
      }
    }
  }

  function downloadImage(url: string, filename: string) {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {}
  }

  function pushToast(type: 'success' | 'error', text: string) {
    const id = Date.now() + Math.random();
    toasts = [...toasts, { id, type, text }];
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
    }, 2400);
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getFileIcon(format: string) {
    const ext = format.toLowerCase();
    
    // Image files
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
      return ImageIcon;
    }
    
    // Document files
    if (['txt', 'md', 'doc', 'docx', 'pdf', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'pages', 'numbers', 'key'].includes(ext)) {
      return FileTextIcon;
    }
    
    // Video files
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) {
      return FileVideoIcon;
    }
    
    // Audio files
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) {
      return FileAudioIcon;
    }
    
    // Archive files
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
      return FileArchiveIcon;
    }
    
    // JSON files
    if (['json'].includes(ext)) {
      return FileJsonIcon;
    }
    
    // Code files
    if (['js', 'ts', 'html', 'css', 'xml', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs'].includes(ext)) {
      return FileCodeIcon;
    }
    
    // Default file icon
    return FileIcon;
  }

  function isImageFile(format: string): boolean {
    const ext = format.toLowerCase();
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
  }
</script>

<svelte:window on:keydown={onKeydown} />

<main class="page">
  <header class="header">
    <div class="header-inner">
      <div class="header-title">局域网文件上传</div>
      <section class="toolbar">
        <input id="file-input" class="file-input" type="file" multiple on:change={onFileChange} />
        <label class="btn btn-primary" for="file-input" aria-label="选择文件">
      <ImageIcon size={16} />
      选择文件
    </label>
    {#if errorMessage}
      <span class="error">{errorMessage}</span>
    {/if}
      </section>
    </div>
  </header>

  <section>
    <h2>文件库</h2>
    <div class="tabs">
      <button class="tab {activeTab === 'all' ? 'active' : ''}" on:click={() => (activeTab = 'all')}>所有上传</button>
      <button class="tab {activeTab === 'mine' ? 'active' : ''}" on:click={() => (activeTab = 'mine')}>本机上传</button>
    </div>
    <div class="sort-controls">
      <div class="sort-group">
        <button 
          class="sort-btn {sortBy === 'time-desc' ? 'active' : ''}" 
          on:click={() => sortBy = 'time-desc'}
        >
          时间↓
        </button>
        <button 
          class="sort-btn {sortBy === 'time-asc' ? 'active' : ''}" 
          on:click={() => sortBy = 'time-asc'}
        >
          时间↑
        </button>
        <button 
          class="sort-btn {sortBy === 'name' ? 'active' : ''}" 
          on:click={() => sortBy = 'name'}
        >
          文件名
        </button>
        <button 
          class="sort-btn {sortBy === 'size-desc' ? 'active' : ''}" 
          on:click={() => sortBy = 'size-desc'}
        >
          大小↓
        </button>
        <button 
          class="sort-btn {sortBy === 'size-asc' ? 'active' : ''}" 
          on:click={() => sortBy = 'size-asc'}
        >
          大小↑
        </button>
      </div>
      <div class="layout-toggle">
        <button 
          class="layout-btn {layout === 'grid' ? 'active' : ''}" 
          on:click={() => layout = 'grid'}
          aria-label="网格布局"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        </button>
        <button 
          class="layout-btn {layout === 'list' ? 'active' : ''}" 
          on:click={() => layout = 'list'}
          aria-label="列表布局"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
    {#if visibleImages.length === 0}
      <p>暂无文件</p>
    {:else if layout === 'grid'}
      <div class="grid">
        {#each visibleImages as file}
          <div class="card">
            {#if isImageFile(file.format)}
              <button type="button" class="thumb-btn" on:click={() => (preview = file)} aria-label="预览文件">
                <div class="thumb-wrap">
                  <img src={file.url} alt={file.filename} class="thumb" />
                </div>
              </button>
            {:else}
              <div class="file-icon-wrap">
                <svelte:component this={getFileIcon(file.format)} size={48} color="#6b7280" />
              </div>
            {/if}
            <div class="filename" title={file.filename}>{file.filename}</div>
            <div class="actions btn-group" role="group" aria-label="文件操作">
              <button type="button" class="btn-icon" on:click={() => downloadImage(file.url, file.filename)} aria-label="下载文件">
                <DownloadIcon size={14} /> 下载
              </button>
              <button type="button" class="btn-icon btn-danger" on:click={() => deleteImage(file.filename)} aria-label="删除文件">
                <TrashIcon size={14} /> 删除
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="list-container">
        <div class="list-header">
          <div class="list-col-thumb">预览</div>
          <div class="list-col-name">文件名</div>
          <div class="list-col-format">格式</div>
          <div class="list-col-size">大小</div>
          <div class="list-col-time">上传时间</div>
          <div class="list-col-actions">操作</div>
        </div>
        {#each visibleImages as file}
          <div class="list-row">
            <div class="list-col-thumb">
              {#if isImageFile(file.format)}
                <button type="button" class="list-thumb-btn" on:click={() => (preview = file)} aria-label="预览文件">
                  <img src={file.url} alt={file.filename} class="list-thumb" />
                </button>
              {:else}
                <div class="list-file-icon">
                  <svelte:component this={getFileIcon(file.format)} size={32} color="#6b7280" />
                </div>
              {/if}
            </div>
            <div class="list-col-name">
              <span class="list-filename" title={file.filename}>{file.filename}</span>
            </div>
            <div class="list-col-format">
              <span class="format-badge">{file.format.toUpperCase()}</span>
            </div>
            <div class="list-col-size">
              <span>{formatFileSize(file.size)}</span>
            </div>
            <div class="list-col-time">
              <span>{formatDate(file.uploadTime)}</span>
            </div>
            <div class="list-col-actions">
              <div class="actions btn-group" role="group" aria-label="文件操作">
                <button type="button" class="btn-icon" on:click={() => downloadImage(file.url, file.filename)} aria-label="下载文件">
                  <DownloadIcon size={14} /> 下载
                </button>
                <button type="button" class="btn-icon btn-danger" on:click={() => deleteImage(file.filename)} aria-label="删除文件">
                  <TrashIcon size={14} /> 删除
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  {#if preview}
    <button
      type="button"
      class="modal-backdrop"
      on:click={() => (preview = null)}
    >
      <div class="modal" role="dialog" aria-modal="true" aria-label="文件预览" tabindex="-1" on:click|stopPropagation on:keydown|stopPropagation>
        {#if isImageFile(preview.format)}
          <img src={preview.url} alt={preview.filename} />
        {:else}
          <div class="modal-file-icon">
            <svelte:component this={getFileIcon(preview.format)} size={64} color="#6b7280" />
          </div>
        {/if}
        <div class="modal-filename">{preview.filename}</div>
      </div>
    </button>
  {/if}

  <div class="toast-container" aria-live="polite" aria-atomic="true">
    {#each toasts as t (t.id)}
      <div class="toast {t.type}">{t.text}</div>
    {/each}
  </div>

  <!-- Confirm Modal -->
  {#if confirmModal.show}
    <div class="confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div class="confirm-modal">
        <div class="confirm-header">
          <h3 id="confirm-title" class="confirm-title">{confirmModal.title}</h3>
        </div>
        <div class="confirm-body">
          <p class="confirm-message">{confirmModal.message}</p>
        </div>
        <div class="confirm-footer">
          <button type="button" class="btn btn-outline" on:click={hideConfirm}>
            取消
          </button>
          <button type="button" class="btn btn-danger" on:click={handleConfirm}>
            确认删除
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>

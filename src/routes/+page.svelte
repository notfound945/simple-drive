<script lang="ts">
  import { onMount } from 'svelte';
  import UploadIcon from '$lib/icons/Upload.svelte';
  import ImageIcon from '$lib/icons/Image.svelte';
  import TrashIcon from '$lib/icons/Trash.svelte';
  import DownloadIcon from '$lib/icons/Download.svelte';
  import './+page.css';

  let selectedFiles: File[] = [];
  let uploading = false;
  let images: { filename: string; url: string; size: number; format: string; uploadTime: string }[] = [];
  let myUploads = new Set<string>();
  let activeTab: 'mine' | 'all' = 'all';
  let preview: { filename: string; url: string } | null = null;
  let errorMessage = '';
  let toasts: { id: number; type: 'success' | 'error'; text: string }[] = [];
  let sortBy: 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc' = 'time-desc';
  let layout: 'grid' | 'list' = 'grid';

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

  async function deleteImage(filename: string) {
    try {
      if (!confirm('确认删除该图片吗？')) return;
      const res = await fetch(`/uploads/${encodeURIComponent(filename)}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('删除失败');
      myUploads.delete(filename);
      saveMyUploads();
      await fetchImages();
    } catch (err) {
      errorMessage = (err as Error).message;
    }
  }

  $: visibleImages = activeTab === 'mine' ? images.filter((i) => myUploads.has(i.filename)) : images;
  
  // Reactive: refetch when sort changes
  $: if (sortBy) {
    fetchImages();
  }
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') preview = null;
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
</script>

<svelte:window on:keydown={onKeydown} />

<main class="page">
  <header class="header">
    <div class="header-inner">
      <div class="header-title">局域网图片上传</div>
      <section class="toolbar">
    <input id="file-input" class="file-input" type="file" accept="image/*" multiple on:change={onFileChange} />
        <label class="btn btn-primary" for="file-input" aria-label="选择图片">
      <ImageIcon size={16} />
      选择图片
    </label>
    {#if errorMessage}
      <span class="error">{errorMessage}</span>
    {/if}
      </section>
    </div>
  </header>

  <section>
    <h2>图片库</h2>
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
      <p>暂无图片</p>
    {:else if layout === 'grid'}
      <div class="grid">
        {#each visibleImages as img}
          <div class="card">
            <button type="button" class="thumb-btn" on:click={() => (preview = img)} aria-label="预览图片">
              <div class="thumb-wrap">
                <img src={img.url} alt={img.filename} class="thumb" />
              </div>
            </button>
            <div class="filename">{img.filename}</div>
            <div class="actions btn-group" role="group" aria-label="图片操作">
              <button type="button" class="btn-icon" on:click={() => downloadImage(img.url, img.filename)} aria-label="下载图片">
                <DownloadIcon size={14} /> 下载
              </button>
              <button type="button" class="btn-icon btn-danger" on:click={() => deleteImage(img.filename)} aria-label="删除图片">
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
        {#each visibleImages as img}
          <div class="list-row">
            <div class="list-col-thumb">
              <button type="button" class="list-thumb-btn" on:click={() => (preview = img)} aria-label="预览图片">
                <img src={img.url} alt={img.filename} class="list-thumb" />
              </button>
            </div>
            <div class="list-col-name">
              <span class="list-filename" title={img.filename}>{img.filename}</span>
            </div>
            <div class="list-col-format">
              <span class="format-badge">{img.format.toUpperCase()}</span>
            </div>
            <div class="list-col-size">
              <span>{formatFileSize(img.size)}</span>
            </div>
            <div class="list-col-time">
              <span>{formatDate(img.uploadTime)}</span>
            </div>
            <div class="list-col-actions">
              <div class="actions btn-group" role="group" aria-label="图片操作">
                <button type="button" class="btn-icon" on:click={() => downloadImage(img.url, img.filename)} aria-label="下载图片">
                  <DownloadIcon size={14} /> 下载
                </button>
                <button type="button" class="btn-icon btn-danger" on:click={() => deleteImage(img.filename)} aria-label="删除图片">
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
      <div class="modal" role="dialog" aria-modal="true" aria-label="图片预览" tabindex="-1" on:click|stopPropagation on:keydown|stopPropagation>
        <img src={preview.url} alt={preview.filename} />
        <div class="modal-filename">{preview.filename}</div>
      </div>
    </button>
  {/if}

  <div class="toast-container" aria-live="polite" aria-atomic="true">
    {#each toasts as t (t.id)}
      <div class="toast {t.type}">{t.text}</div>
    {/each}
  </div>
</main>

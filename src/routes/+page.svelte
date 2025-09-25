<script lang="ts">
  import { onMount } from 'svelte';
  import UploadIcon from '$lib/icons/Upload.svelte';
  import RefreshIcon from '$lib/icons/RefreshCw.svelte';
  import ImageIcon from '$lib/icons/Image.svelte';
  import TrashIcon from '$lib/icons/Trash.svelte';
  import DownloadIcon from '$lib/icons/Download.svelte';
  import './+page.css';

  let selectedFiles: File[] = [];
  let uploading = false;
  let images: { filename: string; url: string }[] = [];
  let myUploads = new Set<string>();
  let activeTab: 'mine' | 'all' = 'all';
  let preview: { filename: string; url: string } | null = null;
  let errorMessage = '';

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
      const res = await fetch('/api/images');
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
  });

  function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    selectedFiles = input.files ? Array.from(input.files) : [];
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
    } catch (err) {
      errorMessage = (err as Error).message;
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
</script>

<svelte:window on:keydown={onKeydown} />

<main class="page">
  <h1>局域网图片上传</h1>
  <section class="toolbar">
    <input id="file-input" class="file-input" type="file" accept="image/*" multiple on:change={onFileChange} />
    <label class="btn btn-outline" for="file-input" aria-label="选择图片">
      <ImageIcon size={16} />
      选择图片
    </label>
    <button class="btn btn-primary" on:click={uploadFiles} disabled={uploading || selectedFiles.length === 0}>
      <UploadIcon size={16} />
      {uploading ? '上传中…' : `上传${selectedFiles.length ? `（${selectedFiles.length}）` : ''}`}
    </button>
    <button class="btn" on:click={fetchImages} aria-label="刷新图片列表">
      <RefreshIcon size={16} />
      刷新
    </button>
    {#if errorMessage}
      <span class="error">{errorMessage}</span>
    {/if}
  </section>

  <section>
    <h2>图片库</h2>
    <div class="tabs">
      <button class="tab {activeTab === 'all' ? 'active' : ''}" on:click={() => (activeTab = 'all')}>所有上传</button>
      <button class="tab {activeTab === 'mine' ? 'active' : ''}" on:click={() => (activeTab = 'mine')}>本机上传</button>
    </div>
    {#if visibleImages.length === 0}
      <p>暂无图片</p>
    {:else}
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
</main>

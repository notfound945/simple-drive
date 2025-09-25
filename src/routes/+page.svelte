<script lang="ts">
  import { onMount } from 'svelte';
  import UploadIcon from '$lib/icons/Upload.svelte';
  import RefreshIcon from '$lib/icons/RefreshCw.svelte';
  import ImageIcon from '$lib/icons/Image.svelte';
  import './+page.css';

  let selectedFiles: File[] = [];
  let uploading = false;
  let images: { filename: string; url: string }[] = [];
  let errorMessage = '';

  async function fetchImages() {
    try {
      const res = await fetch('/api/images');
      if (!res.ok) throw new Error('加载图片列表失败');
      images = await res.json();
    } catch (err) {
      errorMessage = (err as Error).message;
    }
  }

  onMount(fetchImages);

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
      selectedFiles = [];
      await fetchImages();
    } catch (err) {
      errorMessage = (err as Error).message;
    } finally {
      uploading = false;
    }
  }
</script>

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
    {#if images.length === 0}
      <p>暂无图片</p>
    {:else}
      <div class="grid">
        {#each images as img}
          <a href={img.url} target="_blank" rel="noreferrer" class="card">
            <img src={img.url} alt={img.filename} class="thumb" />
            <div class="filename">{img.filename}</div>
          </a>
        {/each}
      </div>
    {/if}
  </section>
</main>

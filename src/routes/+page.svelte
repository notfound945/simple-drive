<script lang="ts">
  import { onMount } from 'svelte';

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

<main style="max-width: 900px; margin: 2rem auto; padding: 1rem;">
  <h1>局域网图片上传</h1>
  <section style="margin: 1rem 0; display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
    <input type="file" accept="image/*" multiple on:change={onFileChange} />
    <button on:click={uploadFiles} disabled={uploading || selectedFiles.length === 0}>
      {uploading ? '上传中…' : `上传${selectedFiles.length ? `（${selectedFiles.length}）` : ''}`}
    </button>
    {#if errorMessage}
      <span style="color: #c00;">{errorMessage}</span>
    {/if}
  </section>

  <section>
    <h2>图片库</h2>
    {#if images.length === 0}
      <p>暂无图片</p>
    {:else}
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px;">
        {#each images as img}
          <a href={img.url} target="_blank" rel="noreferrer" style="display: block; border: 1px solid #eee; border-radius: 8px; overflow: hidden; padding: 8px; text-align: center; background: #fafafa;">
            <img src={img.url} alt={img.filename} style="max-width: 100%; max-height: 140px; object-fit: contain;" />
            <div style="font-size: 12px; margin-top: 6px; word-break: break-all;">{img.filename}</div>
          </a>
        {/each}
      </div>
    {/if}
  </section>
</main>

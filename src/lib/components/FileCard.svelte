<script lang="ts">
  import DownloadIcon from '$lib/icons/Download.svelte';
  import TrashIcon from '$lib/icons/Trash.svelte';
  import { getFileIcon, isImageFile } from '$lib/utils/fileUtils';

  export let file: { filename: string; url: string; size: number; format: string; uploadTime: string };
  export let onPreview: (file: { filename: string; url: string; format: string }) => void;
  export let onDownload: (url: string, filename: string) => void;
  export let onDelete: (filename: string) => void;
</script>

<div class="card">
  {#if isImageFile(file.format)}
    <button type="button" class="thumb-btn" on:click={() => onPreview(file)} aria-label="预览文件">
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
    <button type="button" class="btn-icon" on:click={() => onDownload(file.url, file.filename)} aria-label="下载文件">
      <DownloadIcon size={14} /> 下载
    </button>
    <button type="button" class="btn-icon btn-danger" on:click={() => onDelete(file.filename)} aria-label="删除文件">
      <TrashIcon size={14} /> 删除
    </button>
  </div>
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    padding: 8px;
    text-align: center;
    background: #fafafa;
    min-height: 230px;
    justify-content: space-between;
  }

  .thumb-wrap {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #fff;
    display: grid;
    place-items: center;
    overflow: hidden;
    border-radius: 6px;
  }

  .file-icon-wrap {
    width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: #f3f4f6;
    border: 2px dashed #d1d5db;
    margin: 0 auto;
  }

  .thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumb-btn {
    display: inline-block;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .filename {
    font-size: 12px;
    margin-top: 6px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    max-height: calc(1.4em * 2);
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 0;
    margin-top: auto;
    flex-wrap: nowrap;
  }

  .btn-icon {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.3rem 0.6rem;
    border: 1px solid #e5e7eb;
    background: #fff;
    cursor: pointer;
    color: #111827;
    text-decoration: none;
    font-size: 14px;
    line-height: 1.25;
  }

  .btn-icon:hover {
    text-decoration: none;
  }

  .btn-group .btn-icon {
    border-radius: 0;
  }

  .btn-group .btn-icon:first-child {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }

  .btn-group .btn-icon:last-child {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }

  .btn-group .btn-icon + .btn-icon {
    margin-left: -1px;
  }

  .btn-icon.btn-danger {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }

  .btn-icon.btn-danger:hover {
    background: #fecaca;
  }
</style>

<script lang="ts">
  import DownloadIcon from '$lib/icons/Download.svelte';
  import TrashIcon from '$lib/icons/Trash.svelte';
  import { getFileIcon, isImageFile, formatFileSize, formatDate } from '$lib/utils/fileUtils';

  export let files: { filename: string; url: string; size: number; format: string; uploadTime: string }[];
  export let onPreview: (file: { filename: string; url: string; format: string }) => void;
  export let onDownload: (url: string, filename: string) => void;
  export let onDelete: (filename: string) => void;
</script>

<div class="list-container">
  <div class="list-header">
    <div class="list-col-thumb">预览</div>
    <div class="list-col-name">文件名</div>
    <div class="list-col-format">格式</div>
    <div class="list-col-size">大小</div>
    <div class="list-col-time">上传时间</div>
    <div class="list-col-actions">操作</div>
  </div>
  {#each files as file}
    <div class="list-row">
      <div class="list-col-thumb">
        {#if isImageFile(file.format)}
          <button type="button" class="list-thumb-btn" on:click={() => onPreview(file)} aria-label="预览文件">
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
          <button type="button" class="btn-icon" on:click={() => onDownload(file.url, file.filename)} aria-label="下载文件">
            <DownloadIcon size={14} /> 下载
          </button>
          <button type="button" class="btn-icon btn-danger" on:click={() => onDelete(file.filename)} aria-label="删除文件">
            <TrashIcon size={14} /> 删除
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  /* List layout styles */
  .list-container {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #fff;
  }

  .list-header {
    display: grid;
    grid-template-columns: 60px 1fr 80px 100px 160px 140px;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    font-size: 14px;
    color: #374151;
  }

  .list-row {
    display: grid;
    grid-template-columns: 60px 1fr 80px 100px 160px 140px;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f3f4f6;
    align-items: center;
  }

  .list-row:last-child {
    border-bottom: none;
  }

  .list-row:hover {
    background: #f9fafb;
  }

  .list-col-thumb {
    display: flex;
    justify-content: center;
  }

  .list-thumb-btn {
    width: 48px;
    height: 48px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 0.375rem;
    overflow: hidden;
    padding: 0;
  }

  .list-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .list-file-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
  }

  .list-filename {
    font-size: 14px;
    color: #111827;
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

  .list-col-format {
    display: flex;
    justify-content: center;
  }

  .format-badge {
    background: #e5e7eb;
    color: #374151;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 12px;
    font-weight: 600;
  }

  .list-col-size,
  .list-col-time {
    font-size: 14px;
    color: #6b7280;
  }

  .list-col-actions {
    display: flex;
    justify-content: center;
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

  /* 中等屏幕 - 隐藏时间列 */
  @media (max-width: 768px) {
    .list-header,
    .list-row {
      grid-template-columns: 50px 1fr 60px 80px 100px;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
    }
    
    .list-thumb-btn {
      width: 40px;
      height: 40px;
    }
    
    .list-col-time {
      display: none;
    }
    
    .list-header .list-col-time {
      display: none;
    }
  }

  /* 小屏幕 - 只显示预览、名称和操作 */
  @media (max-width: 480px) {
    .list-header,
    .list-row {
      grid-template-columns: 40px 1fr 80px;
      gap: 0.5rem;
      padding: 0.5rem;
    }
    
    .list-thumb-btn {
      width: 32px;
      height: 32px;
    }
    
    .list-file-icon {
      width: 32px;
      height: 32px;
    }
    
    .list-col-format,
    .list-col-size,
    .list-col-time {
      display: none;
    }
    
    .list-header .list-col-format,
    .list-header .list-col-size,
    .list-header .list-col-time {
      display: none;
    }
    
    .list-col-actions .btn-group {
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .list-col-actions .btn-icon {
      padding: 0.25rem 0.5rem;
      font-size: 12px;
      border-radius: 0.25rem;
    }
    
    .list-col-actions .btn-group .btn-icon:first-child,
    .list-col-actions .btn-group .btn-icon:last-child {
      border-radius: 0.25rem;
    }
    
    .list-col-actions .btn-group .btn-icon + .btn-icon {
      margin-left: 0;
    }
  }

  /* 超小屏幕 - 进一步优化 */
  @media (max-width: 360px) {
    .list-header,
    .list-row {
      grid-template-columns: 32px 1fr 60px;
      gap: 0.25rem;
      padding: 0.5rem 0.25rem;
    }
    
    .list-thumb-btn {
      width: 28px;
      height: 28px;
    }
    
    .list-file-icon {
      width: 28px;
      height: 28px;
    }
    
    .list-filename {
      font-size: 12px;
    }
    
    .list-col-actions .btn-icon {
      padding: 0.2rem 0.4rem;
      font-size: 11px;
    }
  }
</style>

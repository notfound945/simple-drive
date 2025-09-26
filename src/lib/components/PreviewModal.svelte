<script lang="ts">
  import { getFileIcon, isImageFile } from '$lib/utils/fileUtils';

  export let preview: { filename: string; url: string; format: string } | null;
  export let onClose: () => void;
</script>

{#if preview}
  <button
    type="button"
    class="modal-backdrop"
    on:click={onClose}
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

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal {
    background: #fff;
    max-width: 90vw;
    max-height: 90vh;
    padding: 12px;
    border-radius: 8px;
  }

  .modal img {
    max-width: 100%;
    max-height: 80vh;
    display: block;
  }

  .modal-file-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .modal-filename {
    margin-top: 8px;
    font-size: 12px;
    color: #4b5563;
    word-break: break-all;
    text-align: center;
  }
</style>

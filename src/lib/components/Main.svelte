<script lang="ts">
  import { FileCard, FileList, PreviewModal, ConfirmModal, ToastContainer, SortGroup, LayoutGroup, TabGroup } from './index';

  // Props
  export let images: { filename: string; url: string; size: number; format: string; uploadTime: string }[];
  export let myUploads: Set<string>;
  export let activeTab: 'mine' | 'all';
  export let sortBy: 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc';
  export let layout: 'grid' | 'list';
  export let preview: { filename: string; url: string; format: string } | null;
  export let confirmModal: { show: boolean; title: string; message: string; onConfirm: () => void };
  export let toasts: { id: number; type: 'success' | 'error'; text: string }[];

  // Event handlers
  export let onTabChange: (tab: 'mine' | 'all') => void;
  export let onSortChange: (sort: 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc') => void;
  export let onLayoutChange: (layout: 'grid' | 'list') => void;
  export let onPreview: (file: { filename: string; url: string; format: string } | null) => void;
  export let onDownload: (url: string, filename: string) => void;
  export let onDelete: (filename: string) => void;
  export let onKeydown: (e: KeyboardEvent) => void;
  export let hideConfirm: () => void;
  export let handleConfirm: () => void;

  // Computed
  $: visibleImages = activeTab === 'mine' ? images.filter((i) => myUploads.has(i.filename)) : images;
</script>

<svelte:window on:keydown={onKeydown} />

<div class="page-content">
  <section>
    <h2>文件库</h2>
    <TabGroup {activeTab} {onTabChange} />
    <div class="sort-controls">
      <SortGroup {sortBy} {onSortChange} />
      <div class="layout-toggle">
        <LayoutGroup {layout} {onLayoutChange} />
      </div>
    </div>
    {#if visibleImages.length === 0}
      <p>暂无文件</p>
    {:else if layout === 'grid'}
      <div class="grid">
        {#each visibleImages as file}
          <FileCard {file} {onPreview} {onDownload} {onDelete} />
        {/each}
      </div>
    {:else}
      <FileList files={visibleImages} {onPreview} {onDownload} {onDelete} />
    {/if}
  </section>

  <PreviewModal {preview} onClose={() => onPreview(null)} />
  
  <ToastContainer {toasts} />
  
  <ConfirmModal {confirmModal} onHide={hideConfirm} onConfirm={handleConfirm} />
</div>

<style>
  .page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .sort-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0 1rem;
    flex-wrap: wrap;
  }

  .layout-toggle {
    display: flex;
    gap: 0.25rem;
    margin-left: auto;
  }

  /* 响应式隐藏排序按钮组 */
  @media (max-width: 460px) {
    .sort-controls :global(.button-group.sort-group) {
      display: none;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
</style>

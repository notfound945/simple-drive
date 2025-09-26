<script lang="ts">
  import { FileCard, FileList, PreviewModal, ConfirmModal, ToastContainer } from './index';

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
  export let onPreview: (file: { filename: string; url: string; format: string }) => void;
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
    <div class="tabs">
      <button class="tab {activeTab === 'all' ? 'active' : ''}" on:click={() => onTabChange('all')}>所有上传</button>
      <button class="tab {activeTab === 'mine' ? 'active' : ''}" on:click={() => onTabChange('mine')}>本机上传</button>
    </div>
    <div class="sort-controls">
      <div class="sort-group">
        <button 
          class="sort-btn {sortBy === 'time-desc' ? 'active' : ''}" 
          on:click={() => onSortChange('time-desc')}
        >
          时间↓
        </button>
        <button 
          class="sort-btn {sortBy === 'time-asc' ? 'active' : ''}" 
          on:click={() => onSortChange('time-asc')}
        >
          时间↑
        </button>
        <button 
          class="sort-btn {sortBy === 'name' ? 'active' : ''}" 
          on:click={() => onSortChange('name')}
        >
          文件名
        </button>
        <button 
          class="sort-btn {sortBy === 'size-desc' ? 'active' : ''}" 
          on:click={() => onSortChange('size-desc')}
        >
          大小↓
        </button>
        <button 
          class="sort-btn {sortBy === 'size-asc' ? 'active' : ''}" 
          on:click={() => onSortChange('size-asc')}
        >
          大小↑
        </button>
      </div>
      <div class="layout-toggle">
        <button 
          class="layout-btn {layout === 'grid' ? 'active' : ''}" 
          on:click={() => onLayoutChange('grid')}
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
          on:click={() => onLayoutChange('list')}
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

  .tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    margin: 0.5rem 0 1rem;
    gap: 0.5rem;
  }

  .tab {
    padding: 0.4rem 0.75rem;
    border: 1px solid transparent;
    border-bottom: none;
    border-radius: 0.5rem 0.5rem 0 0;
    cursor: pointer;
    background: transparent;
  }

  .tab.active {
    border-color: #e5e7eb;
    background: #fff;
  }

  .sort-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0 1rem;
    flex-wrap: wrap;
  }

  .sort-group {
    display: flex;
    gap: 0;
  }

  .sort-btn {
    padding: 0.4rem 0.6rem;
    border: 1px solid #d1d5db;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    color: #374151;
    white-space: nowrap;
  }

  .sort-btn:first-child {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }

  .sort-btn:last-child {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }

  .sort-btn:not(:first-child) {
    margin-left: -1px;
  }

  .sort-btn.active {
    background: #2563eb;
    color: #fff;
    border-color: #1d4ed8;
    z-index: 1;
  }

  .sort-btn:hover:not(.active) {
    background: #f3f4f6;
  }

  .layout-toggle {
    display: flex;
    gap: 0.25rem;
    margin-left: auto;
  }

  .layout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid #d1d5db;
    background: #fff;
    cursor: pointer;
    border-radius: 0.375rem;
    color: #6b7280;
  }

  .layout-btn:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .layout-btn:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
  }

  .layout-btn.active {
    background: #2563eb;
    color: #fff;
    border-color: #1d4ed8;
  }

  .layout-btn:hover:not(.active) {
    background: #f3f4f6;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
</style>

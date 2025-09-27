<script lang="ts">
  import { onDestroy } from 'svelte';
  import { formatDate } from '$lib/utils';
  type ClipboardItem = {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
  };

  export let show: boolean;
  export let items: ClipboardItem[];
  export let onClose: () => void;
  export let onAdd: (text: string) => Promise<void> | void;
  export let onUpdate: (id: string, text: string) => Promise<void> | void;
  export let onDelete: (id: string) => Promise<void> | void;
  export let pushToast: (type: 'success' | 'error', text: string) => void;

  let inputText = '';
  let editingId: string | null = null;
  let editingText = '';

  // 基于 show 的响应式滚动锁，支持多模态计数，避免重复打开失效
  let lockedByThis = false;
  function lockScroll() {
    const root = document.documentElement as HTMLElement & { dataset: Record<string, string | undefined> };
    const current = Number(root.dataset.modalLockCount || '0');
    if (current === 0) {
      root.dataset.modalPrevOverflow = root.style.overflow || '';
      root.style.overflow = 'hidden';
    }
    root.dataset.modalLockCount = String(current + 1);
    lockedByThis = true;
  }
  function unlockScroll() {
    const root = document.documentElement as HTMLElement & { dataset: Record<string, string | undefined> };
    const now = Number(root.dataset.modalLockCount || '1');
    const next = Math.max(0, now - 1);
    if (next === 0) {
      const prev = root.dataset.modalPrevOverflow || '';
      root.style.overflow = prev;
      delete root.dataset.modalPrevOverflow;
      delete root.dataset.modalLockCount;
    } else {
      root.dataset.modalLockCount = String(next);
    }
    lockedByThis = false;
  }

  $: if (show) {
    if (!lockedByThis && typeof document !== 'undefined') lockScroll();
  } else {
    if (lockedByThis && typeof document !== 'undefined') unlockScroll();
  }

  onDestroy(() => {
    if (lockedByThis && typeof document !== 'undefined') unlockScroll();
  });

  function blockWheelAtBackdrop(e: WheelEvent) {
    // 仅当滚动发生在背板空白区域时阻止默认，从而避免滚动穿透到底部内容
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  }

  function blockTouchAtBackdrop(e: TouchEvent) {
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  }

  function startEdit(item: ClipboardItem) {
    editingId = item.id;
    editingText = item.text;
  }

  function cancelEdit() {
    editingId = null;
    editingText = '';
  }

  async function confirmEdit() {
    if (!editingId) return;
    const text = editingText.trim();
    if (!text) {
      pushToast('error', '内容不能为空');
      return;
    }
    try {
      await onUpdate(editingId, text);
      pushToast('success', '已更新');
      cancelEdit();
    } catch (err) {
      pushToast('error', '更新失败');
    }
  }

  async function addItem() {
    const text = inputText.trim();
    if (!text) {
      pushToast('error', '内容不能为空');
      return;
    }
    try {
      await onAdd(text);
      inputText = '';
      pushToast('success', '已添加');
    } catch (err) {
      pushToast('error', '添加失败');
    }
  }

  async function deleteItem(id: string) {
    try {
      await onDelete(id);
      pushToast('success', '已删除');
    } catch (err) {
      pushToast('error', '删除失败');
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      pushToast('success', '已复制到剪贴板');
    } catch (err) {
      pushToast('error', '复制失败');
    }
  }

  // 锁定背景滚动：仅拦截在 backdrop 上的滚动事件，模态内部允许滚动
  function handleBackdropWheel(e: WheelEvent) {
    e.preventDefault();
  }
  function handleBackdropTouchMove(e: TouchEvent) {
    e.preventDefault();
  }
</script>

{#if show}
  <div class="cb-backdrop" role="dialog" aria-modal="true" aria-labelledby="cb-title" on:wheel={blockWheelAtBackdrop} on:touchmove={blockTouchAtBackdrop}>
    <div class="cb-modal">
      <div class="cb-header">
        <h3 id="cb-title" class="cb-title">剪贴板</h3>
        <button class="cb-close" on:click={onClose} aria-label="关闭">×</button>
      </div>

      <div class="cb-input">
        <textarea
          bind:value={inputText}
          rows="3"
          placeholder="输入内容后点击添加..."
        ></textarea>
        <button class="btn-primary" on:click={addItem}>添加</button>
      </div>

      <div class="cb-list">
        {#if items.length === 0}
          <div class="cb-empty">暂无条目</div>
        {:else}
          {#each items as item (item.id)}
            <div class="cb-item">
              {#if editingId === item.id}
                <textarea bind:value={editingText} rows="3" class="cb-textarea"></textarea>
                <div class="cb-actions">
                  <button class="btn-outline" on:click={cancelEdit}>取消</button>
                  <button class="btn-primary" on:click={confirmEdit}>保存</button>
                </div>
              {:else}
                <div class="cb-content" role="button" tabindex="0" on:dblclick={() => startEdit(item)}>{item.text}</div>
                <div class="cb-actions">
                  <div class="cb-meta" title={item.createdAt}>{formatDate(item.createdAt)}</div>
                  <button class="btn-outline" on:click={() => copyToClipboard(item.text)}>复制</button>
                  <button class="btn-outline" on:click={() => startEdit(item)}>编辑</button>
                  <button class="btn-danger" on:click={() => deleteItem(item.id)}>删除</button>
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .cb-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 70;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }
  .cb-modal {
    background: #fff;
    border-radius: 10px;
    width: min(820px, 96vw);
    max-height: 86vh;
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }
  .cb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  .cb-title { font-size: 15px; font-weight: 600; }
  .cb-close {
    background: transparent;
    border: none;
    font-size: 18px;
    line-height: 18px;
    cursor: pointer;
    color: #6b7280;
  }
  .cb-input { display: flex; gap: 8px; padding: 12px; border-bottom: 1px solid #f3f4f6; }
  .cb-input textarea {
    flex: 1;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 14px;
    resize: vertical;
    min-height: 60px;
  }
  .cb-list { padding: 8px 12px 12px; overflow: auto; }
  .cb-empty { color: #6b7280; padding: 16px; text-align: center; }
  .cb-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; margin: 8px 0; background: #fff; }
  .cb-content { white-space: pre-wrap; word-break: break-word; color: #374151; }
  .cb-textarea { width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; font-size: 14px; }
  .cb-meta { margin-top: 6px; font-size: 12px; color: #6b7280; }
  .cb-actions { display: flex; gap: 8px; align-items: center; justify-content: flex-end; margin-top: 8px; }
  .btn-primary { background: #2563eb; color: #fff; border: 1px solid #1d4ed8; border-radius: 8px; padding: 6px 12px; cursor: pointer; }
  .btn-outline { background: #fff; color: #374151; border: 1px solid #d1d5db; border-radius: 8px; padding: 6px 12px; cursor: pointer; }
  .btn-danger { background: #ef4444; color: #fff; border: 1px solid #dc2626; border-radius: 8px; padding: 6px 12px; cursor: pointer; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-outline:hover { background: #f3f4f6; }
  .btn-danger:hover { background: #dc2626; }
</style>



<script lang="ts">
  export let confirmModal: { show: boolean; title: string; message: string; onConfirm: () => void };
  export let onHide: () => void;
  export let onConfirm: () => void;
</script>

{#if confirmModal.show}
  <div class="confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
    <div class="confirm-modal">
      <div class="confirm-header">
        <h3 id="confirm-title" class="confirm-title">{confirmModal.title}</h3>
      </div>
      <div class="confirm-body">
        <p class="confirm-message">{confirmModal.message}</p>
      </div>
      <div class="confirm-footer">
        <button type="button" class="btn btn-outline" on:click={onHide}>
          取消
        </button>
        <button type="button" class="btn btn-danger" on:click={onConfirm}>
          确认删除
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Confirm Modal */
  .confirm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 60;
    padding: 1rem;
  }

  .confirm-modal {
    background: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
  }

  .confirm-header {
    padding: 1.5rem 1.5rem 0;
  }

  .confirm-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  .confirm-body {
    padding: 1rem 1.5rem;
  }

  .confirm-message {
    margin: 0;
    color: #6b7280;
    line-height: 1.5;
  }

  .confirm-footer {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.8rem;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
  }

  .btn-outline {
    background: #fff;
    color: #111827;
  }

  .btn-outline:hover {
    background: #f3f4f6;
  }

  .btn-danger {
    background: #dc2626;
    color: #fff;
    border: 1px solid #dc2626;
    font-weight: 600;
  }

  .btn-danger:hover {
    background: #b91c1c;
    border-color: #b91c1c;
  }

  .confirm-footer .btn {
    min-width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    font-weight: 500;
  }

  .confirm-footer .btn-outline {
    background: #fff;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .confirm-footer .btn-outline:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  .confirm-footer .btn-danger {
    background: #dc2626;
    color: #fff;
    border: 1px solid #dc2626;
    font-weight: 600;
  }

  .confirm-footer .btn-danger:hover {
    background: #b91c1c;
    border-color: #b91c1c;
  }
</style>

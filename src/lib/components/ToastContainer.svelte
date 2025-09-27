<script lang="ts">
  export let toasts: { id: number; type: 'success' | 'error'; text: string }[];
</script>

<div class="toast-container" aria-live="polite" aria-atomic="true">
  {#each toasts as t (t.id)}
    <div class="toast {t.type}">{t.text}</div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 60;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: min(90vw, 600px);
    width: auto;
    min-width: 200px;
    padding: 0 12px;
    box-sizing: border-box;
  }

  .toast {
    padding: 10px 14px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    font-size: 14px;
    line-height: 1.4;
    border: 1px solid #e5e7eb;
    background: #fff;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    text-align: left;
    white-space: normal;
    width: fit-content;
    max-width: 200px;
    box-sizing: border-box;
  }

  .toast.success { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
  .toast.error { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
</style>

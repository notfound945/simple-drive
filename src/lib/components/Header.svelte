<script lang="ts">
  export let onOpenClipboard: (() => void) | undefined;
  function handleOpenClipboard() {
    if (onOpenClipboard) onOpenClipboard();
  }
</script>

<header class="header">
  <div class="header-inner">
    <div class="header-content">
      <div class="header-title">Simple Drive</div>
      <div class="header-slogan">Share Simple, Simply Share</div>
    </div>
    <div class="header-actions">
      <button class="clipboard-btn" on:click={handleOpenClipboard} aria-label="打开剪贴板">
        <span class="dot" aria-hidden="true"></span>
        剪贴板
      </button>
    </div>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: #ffffffee;
    backdrop-filter: saturate(180%) blur(6px);
    border-bottom: 1px solid #e5e7eb;
    padding: 0.5rem 0.75rem;
    margin: -0.5rem -0.75rem 0.75rem; /* stretch to container edges */
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .header-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .header-slogan {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 400;
    font-style: italic;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .clipboard-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 9999px;
    border: 1px solid #d1d5db;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    color: #1f2937;
    cursor: pointer;
    font-size: 14px;
    transition: box-shadow .15s ease, transform .05s ease, background .15s ease;
  }

  .clipboard-btn:hover {
    background: #eff6ff;
    border-color: #93c5fd;
    box-shadow: 0 2px 10px rgba(37, 99, 235, 0.15);
  }

  .clipboard-btn:active {
    transform: translateY(1px);
  }

  .clipboard-btn .dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
</style>

<script lang="ts">
  // Header组件不需要特殊的props，因为标题和口号是固定的
</script>

<header class="header">
  <div class="header-inner">
    <div class="header-content">
      <div class="header-title">Simple Drive</div>
      <div class="header-slogan">Share Simple, Simply Share</div>
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
</style>

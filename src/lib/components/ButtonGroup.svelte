<script lang="ts">
  export let buttons: Array<{
    key: string;
    label: string;
    active?: boolean;
    icon?: any;
    ariaLabel?: string;
  }>;
  export let onButtonClick: (key: string) => void;
  export let variant: 'sort' | 'layout' = 'sort';
</script>

<div class="button-group {variant}-group">
  {#each buttons as button, index}
    <button 
      class="btn {button.active ? 'active' : ''}" 
      on:click={() => onButtonClick(button.key)}
      aria-label={button.ariaLabel || button.label}
    >
      {#if button.icon}
        <svelte:component this={button.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" />
      {:else}
        {button.label}
      {/if}
    </button>
  {/each}
</div>

<style>
  .button-group {
    display: flex;
    gap: 0;
  }

  .button-group.sort-group {
    gap: 0;
  }

  .button-group.layout-group {
    gap: 0;
  }

  .btn {
    padding: 0.4rem 0.6rem;
    border: 1px solid #d1d5db;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    color: #374151;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Sort button styles */
  .button-group.sort-group .btn:first-child {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }

  .button-group.sort-group .btn:last-child {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }

  .button-group.sort-group .btn:not(:first-child) {
    margin-left: -1px;
  }

  .button-group.sort-group .btn.active {
    background: #2563eb;
    color: #fff;
    border-color: #1d4ed8;
    z-index: 1;
  }

  .button-group.sort-group .btn:hover:not(.active) {
    background: #f3f4f6;
  }

  /* Layout button styles */
  .button-group.layout-group .btn {
    border-radius: 0.375rem;
    color: #6b7280;
  }

  .button-group.layout-group .btn:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .button-group.layout-group .btn:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
  }

  .button-group.layout-group .btn.active {
    background: #2563eb;
    color: #fff;
    border-color: #1d4ed8;
  }

  .button-group.layout-group .btn:hover:not(.active) {
    background: #f3f4f6;
  }
</style>

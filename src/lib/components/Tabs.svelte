<script lang="ts">
  export let tabs: Array<{
    key: string;
    label: string;
    active?: boolean;
  }>;
  export let onTabChange: (key: string) => void;
</script>

<div class="tabs">
  {#each tabs as tab}
    <button 
      class="tab {tab.active ? 'active' : ''}" 
      on:click={() => onTabChange(tab.key)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style>
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
</style>

<script lang="ts">
  import Tabs from './Tabs.svelte';

  export let activeTab: 'mine' | 'all';
  export let onTabChange: (tab: 'mine' | 'all') => void;

  $: tabs = [
    { key: 'all', label: '所有上传', active: activeTab === 'all' },
    { key: 'mine', label: '本机上传', active: activeTab === 'mine' }
  ];

  function handleTabChange(key: string) {
    onTabChange(key as 'mine' | 'all');
  }
</script>

<Tabs {tabs} onTabChange={handleTabChange} />

<script lang="ts">
  import ButtonGroup from './ButtonGroup.svelte';

  export let sortBy: 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc';
  export let onSortChange: (sort: 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc') => void;

  $: buttons = [
    { key: 'time-desc', label: '时间↓', active: sortBy === 'time-desc' },
    { key: 'time-asc', label: '时间↑', active: sortBy === 'time-asc' },
    { key: 'name', label: '文件名', active: sortBy === 'name' },
    { key: 'size-desc', label: '大小↓', active: sortBy === 'size-desc' },
    { key: 'size-asc', label: '大小↑', active: sortBy === 'size-asc' }
  ];

  function handleButtonClick(key: string) {
    onSortChange(key as 'time-desc' | 'time-asc' | 'name' | 'size-desc' | 'size-asc');
  }
</script>

<ButtonGroup {buttons} onButtonClick={handleButtonClick} variant="sort" />

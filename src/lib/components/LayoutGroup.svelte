<script lang="ts">
  import ButtonGroup from './ButtonGroup.svelte';

  export let layout: 'grid' | 'list';
  export let onLayoutChange: (layout: 'grid' | 'list') => void;

  $: buttons = [
    { 
      key: 'grid', 
      label: '网格', 
      active: layout === 'grid',
      ariaLabel: '网格布局'
    },
    { 
      key: 'list', 
      label: '列表', 
      active: layout === 'list',
      ariaLabel: '列表布局'
    }
  ];

  function handleButtonClick(key: string) {
    onLayoutChange(key as 'grid' | 'list');
  }
</script>

<ButtonGroup {buttons} onButtonClick={handleButtonClick} variant="layout" />
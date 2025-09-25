<script lang="ts">
  export let size: number = 16;
  export let stroke: number = 2;
  export let color: string = 'currentColor';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={stroke}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
  <polyline points="14 2 14 8 20 8" />
  <path d="M10 9v6" />
  <path d="M14 9v6" />
  <path d="M10 9a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3V9z" />
</svg>

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
  <polyline points="10 9 9 9 8 9" />
  <path d="m16 15 1.5 1.5-1.5 1.5" />
  <path d="m8 15-1.5 1.5 1.5 1.5" />
  <path d="M12 12v6" />
</svg>

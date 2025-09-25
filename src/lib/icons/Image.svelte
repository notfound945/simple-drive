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
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  <circle cx="9" cy="9" r="2" />
  <path d="m21 15-4-4a2 2 0 0 0-2.83 0L7 18" />
  <path d="m14 14-4 4" />
</svg>



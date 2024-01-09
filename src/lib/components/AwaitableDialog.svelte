<script lang="ts">
  import { dialogs } from '../stores'
</script>


{#each $dialogs as dialog}
  <svelte:component this={dialog.component} {...dialog.data} />
{/each}

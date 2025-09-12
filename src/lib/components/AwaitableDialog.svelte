<script lang="ts">
  import { dialogs } from '../stores'
  import DialogContext from './DialogContext.svelte'
</script>


{#each $dialogs as dialog}
  <DialogContext dialogId={dialog?.data?.dialogId}>
    <svelte:component this={dialog.component} {...dialog.data} />
  </DialogContext>
{/each}

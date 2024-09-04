<script>
  import { closeDialog, resolveDialog } from '$lib'
  import { onMount } from 'svelte'

  export let title = 'Confirm action?'
  let dialog
  onMount(() => {
    dialog && dialog.showModal()
  })
</script>
<dialog bind:this={dialog} on:close={closeDialog}>
  <h1>{title}</h1>
  <button on:click={resolveDialog}>Confirm</button>
  <button on:click={closeDialog}>Cancel</button>
</dialog>

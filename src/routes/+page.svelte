<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet">

<script lang="ts">
  import AwaitableDialog from '$lib'
  import ConfirmDialog from './components/dialog_examples/ConfirmDialog.svelte'
  import { openDialog } from '$lib'
  async function confirm() {
    openDialog(ConfirmDialog, { title: 'qweee', description: 'qwewewe' })
      .then(data => console.log(data.qwe))
      .catch(data => console.log(data.qete))
  }
</script>
<main>
  <button on:click={confirm}>Confirm</button>
  <AwaitableDialog/>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  }
</style>
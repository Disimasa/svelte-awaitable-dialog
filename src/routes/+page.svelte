<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet">

<script lang="ts">
  import AwaitableDialog from '$lib'
  import ConfirmDialog from './components/dialog_examples/ConfirmDialog.svelte'
  import { openDialog } from '$lib'
  import SimpleDialog from './components/dialog_examples/SimpleDialog.svelte'
  async function confirm() {
    openDialog(SimpleDialog, { title: 'Confirm action?' })
      .then(() => console.log('CONFIRMED'))
  }
</script>
<main>
  <button on:click={confirm}>Run action</button>
<!--  You need only one AwaitableDialog on your page (for SvelteKit it's a good idea to add it to root +layout.svelte)-->
  <AwaitableDialog/>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  }
</style>
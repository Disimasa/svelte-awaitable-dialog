<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet">

<script lang="ts">
  import AwaitableDialog from '$lib'
  import ConfirmDialog from './components/dialog_examples/ConfirmDialog.svelte'
  import { openDialog, resolveDialog, rejectDialog, closeDialog } from '$lib'
  import SimpleDialog from './components/dialog_examples/SimpleDialog.svelte'
  let counter = 0
  async function confirm() {
    console.log('before open dialog')
    counter++
    await openDialog(SimpleDialog, { title: 'Confirm action?' + counter })
      .then(() => console.log('CONFIRMED'))
    console.log('after open dialog')
  }

  // Case 1: Reject flow with catch
  async function runReject() {
    try {
      await openDialog(SimpleDialog, { title: 'This will reject' })
      console.log('Unexpected resolve')
    } catch (e) {
      console.log('REJECTED', e)
    }
  }

  // Case 2: Nested dialogs (open inside then open again)
  async function runNested() {
    const first = openDialog(SimpleDialog, { title: 'First dialog' })
    // open second after short delay to simulate user flow
    setTimeout(() => {
      void openDialog(SimpleDialog, { title: 'Second dialog (nested)' })
    }, 0)
    await first
    console.log('First resolved')
  }

  // Case 3: Programmatic resolve via global helper
  async function runProgrammaticResolve() {
    const p = openDialog(SimpleDialog, { title: 'Programmatic resolve in 1s' })
    setTimeout(() => resolveDialog({ auto: true }), 1000)
    await p
    console.log('Resolved by timer')
  }

  // Case 4: Programmatic reject via global helper
  async function runProgrammaticReject() {
    const p = openDialog(SimpleDialog, { title: 'Programmatic reject in 1s' })
    setTimeout(() => rejectDialog({ reason: 'timeout' }), 1000)
    try {
      await p
    } catch (e) {
      console.log('Rejected by timer', e)
    }
  }

  // Case 5: Close without resolving
  async function runClose() {
    const p = openDialog(SimpleDialog, { title: 'Will be closed (no resolve)' })
    setTimeout(() => closeDialog(), 1000)
    await p.catch(() => {})
    console.log('Closed without resolve/reject')
  }
</script>
<main>
  <button on:click={confirm}>Run action</button>
  <button on:click={runReject}>Run reject</button>
  <button on:click={runNested}>Run nested</button>
  <button on:click={runProgrammaticResolve}>Programmatic resolve</button>
  <button on:click={runProgrammaticReject}>Programmatic reject</button>
  <button on:click={runClose}>Close top</button>
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
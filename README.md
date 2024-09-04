# svelte-awaitable-dialog

[![NPM](https://img.shields.io/npm/v/svelte-awaitable-dialog)](https://www.npmjs.com/package/svelte-awaitable-dialog)

Js library for opening custom modal windows/dialogs/drawers and getting data from them inside a regular js function. 
With its help, you can get rid of adding additional variables to track the opening of a dialog and storing data from it, 
as well as adding the layout components themselves.

## Demo

[REPL Link](https://svelte.dev/repl/ed41385a591b4e25b082cf1caf340e2b?version=4.2.19)

## Installation

```bash
npm install svelte-awaitable-dialog
```

Or with Yarn

```bash
yarn add svelte-awaitable-dialog
```

## Usage

For example, like that you can get user confirmation by the simplest dialog:

SimpleDialog.svelte
```svelte
<script>
  import { closeDialog, resolveDialog } from 'svelte-awaitable-dialog'
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
```

+page.svelte
```svelte
<script lang="ts">
  import { AwaitableDialog, openDialog } from 'svelte-awaitable-dialog'
  import SimpleDialog from './components/dialog_examples/SimpleDialog.svelte'
  async function confirm() {
    // Here you can pass any custom Svelte component and its props
    openDialog(SimpleDialog, { title: 'Confirm action?' })
      .then(() => console.log('CONFIRMED'))
  }
</script>

<button on:click={confirm}>Run action</button>
<!--  You need only one AwaitableDialog on your page (for SvelteKit it's a good idea to add it to root +layout.svelte)-->
<AwaitableDialog/>
```

Also there's opportunity to return data from dialog as promise result by passing data object to resolveDialog function. Check REPL for example.

## API

### Methods

#### ```openDialog```:
Opens custom dialog component and returns Promise with data resolved from dialog

**Parameters**

- component: ```ComponentType<T>```. Custom Svelte component to render
- data: ```Partial<ComponentProps<T>> = {}```. Props of passed component

#### ```resolveDialog```:
Resolves openDialog Promise with data and closes dialog

**Parameters**

- data: ```object```.   Arbitrary object with data which can be obtained in openDialog Promise

#### ```closeDialog```:
Closes opened dialog

## License

MIT

## Show your support

Give a ⭐️ if this project helped you!

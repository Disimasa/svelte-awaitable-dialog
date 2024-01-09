<script>
  import DialogWrapper from './DialogWrapper.svelte'
  import { fade } from 'svelte/transition'
  import {openDialog, rejectDialog, resolveDialog, closeDialog} from '$lib'
  import ConfirmDialog from "./ConfirmDialog.svelte";
  export let title = 'Confirm?'
  export let description = ''
  export let confirmTitle = 'Confirm'
  export let refuseTitle = 'Refuse'
  export let useRefuseButton = true

  function confirm() {
    resolveDialog()
  }

  function refuse() {
    closeDialog()
  }
</script>
<div transition:fade>
  <DialogWrapper on:bg-click={refuse}>
    <div class="cross" on:click={refuse}>
      ╳
    </div>
    <div class="content">
      <h2>{title}</h2>
      <p>{description}</p>
      <div class="buttons-wrapper">
        <button on:click={confirm}>{confirmTitle}</button>
        {#if useRefuseButton}
          <button on:click={refuse}>{refuseTitle}</button>
        {/if}
      </div>
      <button on:click={() => {openDialog(ConfirmDialog, {})}}>Новое окно</button>
    </div>
  </DialogWrapper>
</div>
<style>
  .content {
    padding: 2rem;
    width: 400px;
    max-width: 500px;
  }

  .cross {
    position: absolute;
    font-size: 0.8rem;
    top: 0;
    right: 0;
    padding: 0.3rem;
    margin: 0.3rem;
  }

  .cross:hover {
    cursor: pointer;
  }

  h2 {
    text-align: center;
    margin: 0 0 1rem 0;
  }

  p {
    text-align: center;
  }

  .buttons-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  button {
    flex: 1;
    align-items: center;
    background-color: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: .25rem;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    line-height: 1.25;
    transition: all 250ms;
    padding: 0.6rem 2rem;
    margin: 5px;
  }

  button:hover,
  button:focus {
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  }

  button:hover {
    transform: translateY(-1px);
  }
</style>
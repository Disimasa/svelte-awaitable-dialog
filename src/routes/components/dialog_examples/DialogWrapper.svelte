<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  function clickOutside(node) {

    const handleClick = event => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(
          new CustomEvent('click_outside', node)
        )
      }
    }

    document.addEventListener('click', handleClick, true);

    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    }
  }

  function handleBgClick() {
    dispatch('bg-click')
  }
</script>
<div class="background">
  <div role="dialog" class="modal" use:clickOutside on:click_outside={handleBgClick}>
    <slot/>
  </div>
</div>

<style>
  .background {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #adaaaa;
    opacity: 70%;
    z-index: 30;
  }

  .modal {
    min-width: 240px;
    border-radius: 16px;
    background: #FFFFFF;
    position: relative;
    z-index: 50;
  }
</style>
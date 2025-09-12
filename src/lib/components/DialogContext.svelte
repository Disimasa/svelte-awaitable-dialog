<script lang="ts">
  export let dialogId: string
</script>

<div data-dialog-id={dialogId} style="display: contents">
  <slot />
</div>



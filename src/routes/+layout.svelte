<script>
  import "../app.css";

  import { Toast } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import ErrorIcon from "$lib/components/icons/ErrorIcon.svelte";
  import { onDestroy } from "svelte";
  import { toastMessage } from "$lib/stores";

  const interval = setInterval(() => {
    toastMessage.update((tm) => ({ ...tm, remainingMs: tm.remainingMs - 500 }));
  }, 500);

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="bg-wallpaper w-full min-h-screen">
  <Toast simple position="top-right" transition={slide} open={$toastMessage.remainingMs > 0}>
    {#if $toastMessage.type === "error"}
      <ErrorIcon slot="icon" />
      <span class="text-error">
        <b>Error:</b>
        {$toastMessage.message}
      </span>
    {:else}
      {$toastMessage.message}
    {/if}
  </Toast>

  <slot />
</div>

<script lang="ts">
  import "../app.css";

  import { Toast } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import { onDestroy } from "svelte";
  import { toastMessage } from "$lib/stores";
  import { derived } from "svelte/store";
  import { dedupe } from "$lib/utils";
  import { browser } from "$app/environment";

  const interval = setInterval(() => {
    toastMessage.update((tm) => ({ ...tm, remainingMs: tm.remainingMs - 500 }));
  }, 500);

  const unsubscribe = dedupe(derived(toastMessage, (tm) => tm.message)).subscribe(() => {
    if (browser && window) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });

  onDestroy(() => {
    unsubscribe();
    clearInterval(interval);
  });
</script>

<div class="bg-wallpaper w-full min-h-screen">
  <Toast simple position="top-right" transition={slide} open={$toastMessage.remainingMs > 0}>
    {#if $toastMessage.type === "error"}
      <span class="text-error-500">
        <b>Error:</b>
        {$toastMessage.message}
      </span>
    {:else}
      {$toastMessage.message}
    {/if}
  </Toast>

  <slot />
</div>

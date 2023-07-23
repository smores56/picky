<script lang="ts">
  import "../app.css";

  import { Toast } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import { onDestroy } from "svelte";
  import { toastMessage } from "$lib/toast";
  import { browser } from "$app/environment";

  const unsubscribe = toastMessage.subscribe(() => {
    if (browser && window) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="bg-wallpaper w-full min-h-screen">
  <Toast simple position="top-right" transition={slide} open={!!$toastMessage.message}>
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

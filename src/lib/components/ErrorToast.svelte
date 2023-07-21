<script lang="ts">
  import { Toast } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import ErrorIcon from "$lib/components/icons/ErrorIcon.svelte";

  let show = false;
  let error = "";

  export const showError = (message: string) => {
    show = true;
    error = message;

    setTimeout(() => {
      show = false;
    }, 5000);
  };
</script>

<Toast simple position="top-right" transition={slide} bind:open={show}>
  <ErrorIcon slot="icon" />
  <span class="text-error">
    <b>Error:</b>
    {error}
  </span>
</Toast>

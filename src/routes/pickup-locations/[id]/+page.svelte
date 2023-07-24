<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { formatAddress } from "$lib/utils";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import type { PickupTab } from ".";
  import { Heading, ListPlaceholder, P } from "flowbite-svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import BottomNav from "./BottomNav.svelte";

  let tab = writable<PickupTab>("home");

  const pickupLocation = trpc($page).pickupLocation.query({ id: parseInt($page.params.id) });

  onMount(() => {
    const currentTab = $page.url.searchParams.get("tab");
    if (currentTab) {
      tab.set(currentTab as PickupTab);
    }

    const unsubscribe = tab.subscribe((t) => {
      if (!browser) return;
      $page.url.searchParams.set("tab", t);
      goto(`?${$page.url.searchParams}`);
    });

    onDestroy(() => {
      unsubscribe();
    });
  });
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />

  <div class="text-center flex flex-col items-center justify-center my-auto">
    {#await pickupLocation}
      <Heading tag="h3" class="mb-6" customSize="text-4xl font-extrabold">
        Loading your store...
      </Heading>
      <ListPlaceholder class="w-full" />
    {:then location}
      <Heading tag="h3" class="mb-6" customSize="text-4xl font-extrabold">
        {location.name}
      </Heading>
      <P class="mb-6 text-lg lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
        <a href="https://www.google.com/maps/place/{formatAddress(location.address)}">
          {formatAddress(location.address)}
        </a>
      </P>

      {#if location.orders.length === 0}
        <i>No pending orders.</i>
      {:else}{/if}

      <ListPlaceholder class="w-full" />
    {:catch err}
      {err}
    {/await}
  </div>
</div>

<BottomNav bind:tab={$tab} />

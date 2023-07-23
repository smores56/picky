<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Navbar from "$lib/components/Navbar.svelte";
  import RightArrowIcon from "$lib/components/icons/RightArrowIcon.svelte";
  import type { PickupLocation } from "$lib/server/db/schema";
  import { sendToast } from "$lib/toast";
  import { trpc } from "$lib/trpc/client";
  import { Button, Heading, ListPlaceholder } from "flowbite-svelte";
  import { onMount } from "svelte";

  let loading = true;
  let pickupLocations: PickupLocation[] = [];

  onMount(async () => {
    const user = await trpc($page).currentUser.query();
    if (!user) {
      goto("/");
      sendToast("Must be logged in to view pickup locations", "error");
    }

    pickupLocations = await trpc($page).pickupLocationsForUser.query();

    if (pickupLocations.length === 1) {
      goto(`/pickup-locations/${pickupLocations[0].id}`);
    }

    loading = false;
  });
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />

  <div class="text-center flex flex-col items-center justify-center my-auto">
    {#if loading}
      <Heading tag="h3" class="mb-6" customSize="text-2xl font-extrabold">
        Loading your stores...
      </Heading>
      <ListPlaceholder class="w-full" />
    {:else if pickupLocations.length === 0}
      <Heading tag="h3" class="mb-4" customSize="text-4xl font-extrabold">
        It looks like you don't have any stores yet.
      </Heading>
      <Button size="lg" href="/pickup-locations/create">
        Register your location
        <RightArrowIcon />
      </Button>
    {:else}
      <Heading tag="h3" class="mb-4" customSize="text-4xl font-extrabold">
        Pick a location to manage:
      </Heading>
    {/if}
  </div>
</div>

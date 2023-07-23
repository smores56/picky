<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { formatAddress } from "$lib/utils";
  import { Heading, ListPlaceholder, P } from "flowbite-svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import BottomNav from "./BottomNav.svelte";

  const pickupLocation = trpc($page).pickupLocation.query({ id: parseInt($page.params.id) });
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
        {formatAddress(location.address)}
      </P>

      <ListPlaceholder class="w-full" />
    {:catch err}
      {err}
    {/await}
  </div>
</div>

<BottomNav />

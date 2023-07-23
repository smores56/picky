<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { onMount } from "svelte";
  import { Navbar, NavBrand, Button } from "flowbite-svelte";

  let actionButtonText = "";
  let actionButtonLink = "";

  onMount(async () => {
    const user = await trpc($page).currentUser.query();
    if (user) {
      if (user.pickupLocations.length === 0) {
        actionButtonText = "Register your location";
        actionButtonLink = "/pickup-locations/create";
      } else if (user.pickupLocations.length === 1) {
        actionButtonText = "My location";
        actionButtonLink = `/pickup-locations/${user.pickupLocations[0]}`;
      } else {
        actionButtonText = "My locations";
        actionButtonLink = "/pickup-locations";
      }
    } else {
      actionButtonText = "Register";
      actionButtonLink = "/register";
    }
  });
</script>

<Navbar class="bg-primary-500">
  <NavBrand href="/">
    <img src="/logo.png" class="mr-3 h-9 sm:h-9" alt="Picky Logo" />
  </NavBrand>

  {#if actionButtonText}
    <div class="flex md:order-2">
      <Button size="sm" class="text-lg bg-secondary-500" href={actionButtonLink}>
        {actionButtonText}
      </Button>
    </div>
  {/if}
</Navbar>

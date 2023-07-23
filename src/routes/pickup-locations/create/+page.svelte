<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { sendToast } from "$lib/toast";
  import { Button, Heading, Input, Label, Spinner } from "flowbite-svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import type { NewAddress } from "$lib/server/db/schema";
  import { getCurrentAddress, getGeoPosition } from "$lib/geocoding";
  import type { ZodCoordinates } from "$lib/trpc/types";
  import type { z } from "zod";
  import type { TRPCClientError } from "@trpc/client";
  import { goto } from "$app/navigation";

  let name = "";
  let address: NewAddress = {
    lineOne: "",
    lineTwo: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    latitude: 0,
    longitude: 0
  };

  let nearbyLocations: z.infer<typeof ZodCoordinates>[] | null = null;

  let loading = false;

  async function autoPopulateAddress() {
    try {
      address = await getCurrentAddress(trpc($page));
    } catch (e) {
      sendToast(e as string, "error");
    }
  }

  async function getNearbyLocations() {
    if (address.latitude === 0 && address.longitude === 0) {
      try {
        const position = await getGeoPosition();
        address.latitude = position.coords.latitude;
        address.longitude = position.coords.longitude;
      } catch (e) {
        sendToast(e as string, "error");
        return;
      }
    }

    try {
      nearbyLocations = await trpc($page).pickupLocationsWithinDistance.query({
        latitude: address.latitude,
        longitude: address.longitude,
        withinMiles: 25
      });
    } catch (e) {
      sendToast((e as TRPCClientError<any>).message, "error");
    }
  }

  async function registerPickupLocation() {
    try {
      loading = true;
      const newPickupLocationId = await trpc($page).registerPickupLocation.mutate({
        name,
        address
      });
      goto(`/pickup-locations/${newPickupLocationId}`);
    } catch (e) {
      sendToast((e as TRPCClientError<any>).message, "error");
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />

  <div class="flex flex-col items-center justify-center my-auto p-12">
    <Heading tag="h3" class="text-4xl mb-6 text-center">Let's register your store!</Heading>

    <form class="flex-none flex-col space-y-6" on:submit|preventDefault={registerPickupLocation}>
      <div>
        <Label for="name" class="mb-2">Name</Label>
        <Input type="text" id="name" placeholder="The Widget Shop" required bind:value={name} />
      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <Label for="address_line_one" class="mb-2">Address Line One *</Label>
          <Input
            type="text"
            id="address_line_one"
            placeholder="123 Acorn Lane"
            required
            bind:value={address.lineOne}
          />
        </div>
        <div>
          <Label for="address_line_two" class="mb-2">Address Line Two</Label>
          <Input
            type="text"
            id="address_line_two"
            placeholder="Apt 4"
            bind:value={address.lineTwo}
          />
        </div>
        <div>
          <Label for="city" class="mb-2">City *</Label>
          <Input
            type="text"
            id="city"
            placeholder="Springfield"
            required
            bind:value={address.city}
          />
        </div>
        <div>
          <Label for="state" class="mb-2">State *</Label>
          <Input type="text" id="state" placeholder="NY" required bind:value={address.state} />
        </div>

        <div>
          <Label for="zip_code" class="mb-2">Zip Code *</Label>
          <Input
            type="text"
            id="zip_code"
            placeholder="12345"
            required
            bind:value={address.zipCode}
          />
        </div>

        <Button color="primary" class="w-full" on:click={autoPopulateAddress}>
          Use my current address
        </Button>
      </div>

      <Button color="primary" type="submit" class="w-full">
        {#if loading}
          Registering...
          <Spinner class="mr-3" size="4" color="white" />
        {:else}
          Register
        {/if}
      </Button>
    </form>
  </div>
</div>

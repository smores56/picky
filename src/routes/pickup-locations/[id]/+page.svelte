<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { formatAddress } from "$lib/utils";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import type { PickupTab } from ".";
  import {
    Button,
    Card,
    Heading,
    ListPlaceholder,
    P,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow
  } from "flowbite-svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import BottomNav from "./BottomNav.svelte";
  import { sendToast } from "$lib/toast";
  import type { TRPCClientError } from "@trpc/client";
  import type { Address, Order } from "$lib/server/db/schema";
  import { fly } from "svelte/transition";
  import { flip } from "svelte/animate";

  const MAX_ORDERS_DISPLAYED = 6;

  let loading = true;
  let mockOrdersLoading = false;

  let pickupLocation: { id: number; name: string; address: Address };
  let orders = [] as (Order & { loading?: boolean })[];

  let tab = writable<PickupTab>("home");

  async function loadData() {
    loading = true;

    try {
      const id = parseInt($page.params.id);
      [pickupLocation, orders] = await Promise.all([
        trpc($page).pickupLocation.query({ id }),
        trpc($page).ordersForPickupLocation.query({ pickupLocationId: id })
      ]);
    } catch (err) {
      sendToast((err as TRPCClientError<any>).message, "error");
    } finally {
      loading = false;
    }
  }

  async function completeOrder(orderId: number) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    try {
      order.loading = true;
      await trpc($page).completeOrder.mutate({ orderId });
      orders = orders.filter((o) => o.id !== orderId);
    } catch (err) {
      sendToast((err as TRPCClientError<any>).message, "error");
    } finally {
      order.loading = false;
    }
  }

  async function generateMockOrders() {
    mockOrdersLoading = true;

    try {
      await trpc($page).generateMockOrders.mutate({
        pickupLocationId: parseInt($page.params.id),
        quantity: 6
      });
    } catch (err) {
      sendToast((err as TRPCClientError<any>).message, "error");
    } finally {
      mockOrdersLoading = false;
    }

    await loadData();
  }

  onMount(async () => {
    await loadData();

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
    {#if loading || !pickupLocation}
      <Heading tag="h3" class="mb-6" customSize="text-4xl font-extrabold">
        Loading your store...
      </Heading>
      <ListPlaceholder class="w-full" />
    {:else}
      <Heading tag="h3" class="my-6" customSize="text-4xl font-extrabold">
        {pickupLocation.name}
      </Heading>
      <P class="mb-6 text-lg lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
        <a href="https://www.google.com/maps/place/{formatAddress(pickupLocation.address)}">
          {formatAddress(pickupLocation.address)}
        </a>
      </P>

      {#if orders.length === 0}
        <i class="p-6">No pending orders.</i>
      {:else}
        <Heading tag="h4" customSize="text-2xl font-extrabold">
          Orders arriving today ({orders.length} total)
        </Heading>
        <div class="grid gap-6 md:grid-cols-2 p-8">
          {#each orders.slice(0, MAX_ORDERS_DISPLAYED) as order, orderIndex (order.id)}
            <div
              animate:flip={{ duration: 500 }}
              in:fly={{ y: 200, duration: 300 }}
              out:fly={{ x: 100, duration: 300 }}
            >
              <Card img="https://loremflickr.com/320/240?random={orderIndex}" horizontal>
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {order.itemName}
                </h5>

                <Table divClass="w-full" striped={true}>
                  <TableBody tableBodyClass="divide-y">
                    <TableBodyRow>
                      <TableBodyCell><b>Buyer</b></TableBodyCell>
                      <TableBodyCell>John Doe</TableBodyCell>
                    </TableBodyRow>
                    <TableBodyRow>
                      <TableBodyCell><b>Weight</b></TableBodyCell>
                      <TableBodyCell>2 lbs</TableBodyCell>
                    </TableBodyRow>
                  </TableBody>
                </Table>
                <Button on:click={() => completeOrder(order.id)}>Mark Complete</Button>
              </Card>
            </div>
          {/each}
        </div>
      {/if}
      <Button size="xl" class="mb-12" color="primary" on:click={generateMockOrders}>
        {#if mockOrdersLoading}
          Generating mock orders...
          <Spinner class="mr-3" size="4" color="white" />
        {:else}
          Generate some mock orders (FOR DEMO)
        {/if}
      </Button>
    {/if}
  </div>

  <BottomNav bind:tab={$tab} />
</div>

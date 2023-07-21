<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { SESSION_TOKEN_NAME } from "$lib/constants";
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from "flowbite-svelte";

  // hidden = false;

  const paths: [string, string][] = [
    // ["/", "Home"],
    // ["/about", "About"]
  ];

  $: sessionToken = browser ? localStorage.getItem(SESSION_TOKEN_NAME) : null;
</script>

<Navbar let:hidden let:toggle class="bg-primary-500">
  <NavBrand href="/">
    <img src="/logo.png" class="mr-3 h-9 sm:h-9" alt="Picky Logo" />
  </NavBrand>

  <div class="flex md:order-2">
    {#if sessionToken}
      <Button size="sm" class="text-lg bg-secondary-500" href="/pickup-console">My console</Button>
    {:else}
      <Button size="sm" class="text-lg bg-secondary-500" href="/register">Get started</Button>
    {/if}
    <!--
    <NavHamburger on:click={toggle} />
    -->
  </div>

  <NavUl {hidden} class="order-1">
    {#each paths as [path, name]}
      <NavLi class="text-black" href={path} active={$page.url.pathname === path}>{name}</NavLi>
    {/each}
  </NavUl>
</Navbar>

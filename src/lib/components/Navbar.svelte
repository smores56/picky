<script lang="ts">
  import { page } from "$app/stores";
  import { SESSION_TOKEN_NAME } from "$lib/constants";
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from "flowbite-svelte";

  const paths: [string, string][] = [
    ["/", "Home"],
    ["/about", "About"]
  ];

  let sessionToken = localStorage.getItem(SESSION_TOKEN_NAME);
</script>

<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <img src="/logo.png" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
      Flowbite
    </span>
  </NavBrand>
  <NavUl {hidden} class="order-1">
    {#each paths as [path, name]}
      <NavLi href={path} active={$page.url.pathname === path}>{name}</NavLi>
    {/each}
  </NavUl>

  <div class="flex md:order-2">
    {#if sessionToken}
      <Button size="sm">Get started</Button>
    {:else}
      <Button size="sm">Go to console</Button>
    {/if}
    <NavHamburger on:click={toggle} />
  </div>
</Navbar>

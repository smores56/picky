<script lang="ts">
  import { page } from "$app/stores";
  import HomeIcon from "$lib/components/icons/HomeIcon.svelte";
  import CreditCardIcon from "$lib/components/icons/CreditCardIcon.svelte";
  import SlidersIcon from "$lib/components/icons/SlidersIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import { BottomNav, BottomNavItem } from "flowbite-svelte";
  import { goto } from "$app/navigation";

  $: tab = $page.url.searchParams.get("tab");

  function setTab(tab: string) {
    $page.url.searchParams.set("tab", tab);
    goto(`?${$page.url.searchParams}`);
  }

  const svgClass = "w-6 h-6 mb-1 text-gray-500 group-hover:text-primary-600";
  const svgActiveClass = "w-6 h-6 mb-1 text-primary-700 group-hover:text-primary-900";
</script>

<BottomNav position="absolute" classInner="grid-cols-4" classActive="font-bold text-blue-700">
  <BottomNavItem btnName="Home" active={tab === "home"} on:click={() => setTab("home")}>
    <HomeIcon svgClass={tab === "home" ? svgActiveClass : svgClass} />
  </BottomNavItem>
  <BottomNavItem btnName="Orders" active={tab === "orders"} on:click={() => setTab("orders")}>
    <CreditCardIcon svgClass={tab === "orders" ? svgActiveClass : svgClass} />
  </BottomNavItem>
  <BottomNavItem btnName="Timing" active={tab === "hours"} on:click={() => setTab("hours")}>
    <SlidersIcon svgClass={tab === "hours" ? svgActiveClass : svgClass} />
  </BottomNavItem>
  <BottomNavItem btnName="Profile" active={tab === "profile"} on:click={() => setTab("profile")}>
    <ProfileIcon svgClass={tab === "profile" ? svgActiveClass : svgClass} />
  </BottomNavItem>
</BottomNav>

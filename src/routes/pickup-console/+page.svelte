<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { trpc } from "$lib/trpc/client";
  import { Card, Button, Label, Input, Checkbox } from "flowbite-svelte";
  import { LOGIN_TOKEN_NAME } from "$lib/constants";

  // On this page:
  // - Unfulfilled orders (Display first 3-5, then have button that says)
  // - Coupons (Display how many coupons, button for coupon creation)
  // - Settings for:
  //   - Pickup Hours (Monday-Sunday, Daily Overrides)
  //   - Contact Info for Pickup
</script>

<div class="w-full h-screen" />

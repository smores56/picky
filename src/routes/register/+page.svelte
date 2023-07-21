<script lang="ts">
  import { Card, Button, Label, Input, Spinner } from "flowbite-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { trpc } from "$lib/trpc/client";
  import type { TRPCClientError } from "@trpc/client";
  import type { NewAddress } from "$lib/server/db/schema";
  import { sendToast } from "$lib/utils";

  let email = "";
  let password = "";
  let firstName = "";
  let lastName = "";
  let address: NewAddress = {
    lineOne: "",
    lineTwo: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  };

  let loading = false;

  async function register() {
    try {
      loading = true;
      await trpc($page).register.mutate({ email, password, firstName, lastName, address });
      await goto("/login");
    } catch (err) {
      sendToast((err as TRPCClientError<any>).message, "error");
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
  <a href="/">
    <img src="/logo.png" height="400px" width="400px" class="mb-6" alt="Picky Logo" />
  </a>

  <Card class="flex flex-none w-1/2 h-1/2">
    <form class="flex-none flex-col space-y-6" on:submit|preventDefault={register}>
      <h3 class="text-xl font-medium text-gray-900">Sign up for Picky</h3>
      <Label class="space-y-2">
        <span>Email</span>
        <Input
          type="email"
          name="email"
          placeholder="name@company.com"
          required
          bind:value={email}
        />
      </Label>
      <Label class="space-y-2">
        <span>Password</span>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          required
          bind:value={password}
        />
      </Label>

      <Button color="primary" type="submit" class="w-full">
        {#if loading}
          <Spinner class="mr-3" size="4" color="white" />
          Creating...
        {:else}
          Create your account
        {/if}
      </Button>

      <div class="text-sm font-medium text-gray-500">
        Already registered?
        <a href="/login" class="text-primary-700 hover:underline">Log in</a>
      </div>
    </form>
  </Card>
</div>

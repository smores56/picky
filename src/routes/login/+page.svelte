<script lang="ts">
  import { Card, Button, Label, Input, Checkbox, Spinner } from "flowbite-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { trpc } from "$lib/trpc/client";
  import { SESSION_TOKEN_NAME } from "$lib/constants";
  import type { TRPCClientError } from "@trpc/client";
  import { sendToast } from "$lib/utils";

  let email = "";
  let password = "";
  let loading = false;

  async function login() {
    try {
      loading = true;
      const token = await trpc($page).login.mutate({ email, password });
      localStorage.setItem(SESSION_TOKEN_NAME, token);
      await goto("/pickup-console");
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
    <form class="flex-none flex-col space-y-6" on:submit|preventDefault={login}>
      <h3 class="text-xl font-medium text-gray-900">Sign in to Picky</h3>
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
      <div class="flex items-start">
        <Checkbox>Remember me</Checkbox>
        <a href="/" class="ml-auto text-sm text-primary-700 hover:underline">Lost password?</a>
      </div>
      <Button color="primary" type="submit" class="w-full">
        {#if loading}
          <Spinner class="mr-3" size="4" color="white" />
          Logging in...
        {:else}
          Log in to your account
        {/if}
      </Button>
      <div class="text-sm font-medium text-gray-500">
        Not registered?
        <a href="/register" class="text-primary-700 hover:underline">Create account</a>
      </div>
    </form>
  </Card>
</div>

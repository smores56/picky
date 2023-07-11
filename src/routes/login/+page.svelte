<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { trpc } from "$lib/trpc/client";
  import { Alert, Card, Button, Label, Input, Checkbox, Spinner } from "flowbite-svelte";
  import { LOGIN_TOKEN_NAME } from "$lib/constants";

  let email = "";
  let password = "";

  // TODO: render these
  let loading = false;
  let error = "";

  async function login() {
    loading = true;
    error = "";

    try {
      const token = await trpc($page).login.mutate({ email, password });
      localStorage.setItem(LOGIN_TOKEN_NAME, token);
      await goto("/pickup-console");
    } catch (err) {
      error = `${err}`;
    } finally {
      loading = false;
    }
  }
</script>

<div class="w-full min-h-screen">
  <Card class="mx-auto my-auto">
    <form class="flex flex-col space-y-6" on:submit={login}>
      <h3 class="text-xl font-medium text-gray-900">Sign in to our platform</h3>
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
        <Input type="password" name="password" placeholder="•••••" required bind:value={password} />
      </Label>
      <div class="flex items-start">
        <Checkbox>Remember me</Checkbox>
        <a href="/" class="ml-auto text-sm text-primary-700 hover:underline">Lost password?</a>
      </div>
      <Button type="submit" class="w-full">
        {#if loading}
          <Spinner class="mr-3" size="4" color="white" />
          Logging in...
        {:else}
          Log in to your account
        {/if}
      </Button>
      <div class="text-sm font-medium text-gray-500">
        Not registered?
        <a href="/" class="text-primary-700 hover:underline">Create account</a>
      </div>

      {#if error}
        <Alert>
          <b>Error: </b>
          {error}
        </Alert>
      {/if}
    </form>
  </Card>
</div>

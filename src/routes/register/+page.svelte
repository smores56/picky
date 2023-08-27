<script lang="ts">
  import { Card, Button, Label, Input, Spinner, Hr, List, Li } from "flowbite-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { trpc } from "$lib/trpc/client";
  import type { TRPCClientError } from "@trpc/client";
  import type { NewAddress } from "$lib/server/db/schema";
  import { getCurrentAddress } from "$lib/geocoding";
  import { sendToast } from "$lib/toast";

  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";
  let confirmPassword = "";

  let loading = false;

  // TODO: https://flowbite-svelte.com/docs/typography/list#Icons
  const passwordRequirements: [string, (p: string) => boolean][] = [
    ["be at least 12 characters", (p) => p.length >= 12],
    ["contain at least one lowercase letter", (p) => !!/[a-z]/.exec(p)],
    ["contain at least one uppercase letter", (p) => !!/[A-Z]/.exec(p)],
    ["contain at least one number", (p) => !!/\d/.exec(p)],
    ["contain at least one symbol", (p) => !!/[^\w\d]/.exec(p)]
  ];

  function validate(): string | null {
    if (passwordRequirements.filter(([_, test]) => !test(password)).length > 0) {
      return "Password does not meet security requirements.";
    } else if (password !== confirmPassword) {
      return "Passwords don't match.";
    } else {
      return null;
    }
  }

  async function register() {
    const error = validate();
    if (error) {
      sendToast(error, "error");
      return;
    }

    try {
      loading = true;
      await trpc($page).register.mutate({ email, password, firstName, lastName });
      await goto("/login");
      sendToast("Account created!", "info");
    } catch (err) {
      sendToast((err as TRPCClientError<any>).message, "error");
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-12">
  <a href="/">
    <img src="/logo.png" height="400px" width="400px" class="mb-6" alt="Picky Logo" />
  </a>

  <Card class="max-w-2xl w-full">
    <h2 class="text-2xl font-medium text-gray-900">Sign up for Picky</h2>

    <form class="flex-none flex-col space-y-6" on:submit|preventDefault={register}>
      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <Label for="first_name" class="mb-2">First name *</Label>
          <Input type="text" id="first_name" placeholder="Casey" required bind:value={firstName} />
        </div>
        <div>
          <Label for="last_name" class="mb-2">Last name *</Label>
          <Input type="text" id="last_name" placeholder="Smith" required bind:value={lastName} />
        </div>
      </div>

      <div>
        <Label for="email" class="mb-2">Email address *</Label>
        <Input
          type="email"
          id="email"
          placeholder="casey.smith@company.com"
          required
          bind:value={email}
        />
      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <Label for="password" class="mb-2">Password *</Label>
          <Input
            type="password"
            id="password"
            placeholder="•••••••••"
            minlength="10"
            required
            bind:value={password}
          />
        </div>
        <div>
          <Label for="confirm_password" class="mb-2">Confirm password *</Label>
          <Input
            type="password"
            id="confirm_password"
            placeholder="•••••••••"
            required
            bind:value={confirmPassword}
          />
        </div>
      </div>

      <div>
        <h5 class="text-lg text-bold">Password must:</h5>
        <List list="disc">
          {#each passwordRequirements as [requirement, test]}
            <Li liClass="text-sm">
              <span class:text-error-500={password && !test(password)}>
                {requirement}
              </span>
            </Li>
          {/each}
        </List>
      </div>

      <div class="mt-8">
        <Button color="primary" type="submit" class="w-full">
          {#if loading}
            <Spinner class="mr-3" size="4" color="white" />
            Registering...
          {:else}
            Register
          {/if}
        </Button>
      </div>

      <div class="text-sm font-medium text-gray-500">
        Already registered?
        <a href="/login" class="text-primary-700 hover:underline">Log in</a>
      </div>
    </form>
  </Card>
</div>

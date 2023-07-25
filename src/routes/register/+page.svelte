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

  let loading = false;

  // TODO: https://flowbite-svelte.com/docs/typography/list#Icons
  const passwordRequirements: [string, (p: string) => boolean][] = [
    ["be at least 12 characters", (p) => p.length >= 12],
    ["contain at least one lowercase letter", (p) => !!/[a-z]/.exec(p)],
    ["contain at least one uppercase letter", (p) => !!/[A-Z]/.exec(p)],
    ["contain at least one number", (p) => !!/\d/.exec(p)],
    ["contain at least one symbol", (p) => !!/[^\w\d]/.exec(p)]
  ];

  async function autoPopulateAddress() {
    try {
      address = await getCurrentAddress(trpc($page));
    } catch (e) {
      sendToast(e as string, "error");
    }
  }

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
      await trpc($page).register.mutate({ email, password, firstName, lastName, address });
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
    <h3 class="text-xl font-medium text-gray-900 mb-2">Sign up for Picky</h3>

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

      <Hr class="my-4 mx-auto md:my-10 h-1" />

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
        <div>
          <Label for="phone" class="mb-2">Phone number</Label>
          <Input
            type="tel"
            id="phone"
            placeholder="123-456-7890"
            bind:value={address.phoneNumber}
          />
        </div>
      </div>

      <Button color="primary" class="w-full" on:click={autoPopulateAddress}>
        Use current address
      </Button>

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

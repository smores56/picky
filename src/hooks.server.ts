import { createTRPCHandle } from "trpc-sveltekit";
import { createContext } from "$lib/trpc/context";
import { appRouter } from "$lib/trpc/router";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = createTRPCHandle({ router: appRouter, createContext });

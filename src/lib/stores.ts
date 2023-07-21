import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { SESSION_TOKEN_NAME } from "./constants";

export const sessionToken = writable<string | null>(null);
if (browser) sessionToken.set(localStorage.getItem(SESSION_TOKEN_NAME));

export type ToastMessageType = "error" | "info";
export type ToastMessage = {
  message: string;
  type: ToastMessageType;
  remainingMs: number;
};

export const toastMessage = writable<ToastMessage>({
  message: "",
  type: "info",
  remainingMs: 0
});

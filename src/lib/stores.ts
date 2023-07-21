import { writable } from "svelte/store";

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

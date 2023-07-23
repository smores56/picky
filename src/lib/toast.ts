import { writable } from "svelte/store";

export type ToastMessageType = "error" | "info";
export type ToastMessage = {
  message: string;
  type: ToastMessageType;
};

const EMPTY_TOAST: ToastMessage = {
  message: "",
  type: "info",
};

export const toastMessage = writable<ToastMessage>(EMPTY_TOAST);
const toastTimeout = writable<NodeJS.Timeout | null>(null);

export function sendToast(message: string, type: ToastMessageType) {
  toastTimeout.update((timeout) => {
    if (timeout) clearTimeout(timeout);

    toastMessage.set({ message, type });

    return setTimeout(() => {
      toastMessage.set(EMPTY_TOAST);
    }, 5000);
  })
}

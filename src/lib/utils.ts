import { derived, type Readable } from "svelte/store";
import { toastMessage, type ToastMessageType } from "./stores";

export function sendToast(message: string, type: ToastMessageType) {
  toastMessage.set({ message, type, remainingMs: 5000 });
}

export function dedupe<T>(store: Readable<T>): Readable<T> {
  let previous: T

  return derived(store, ($value, set) => {
    if ($value !== previous) {
      previous = $value
      set($value)
    }
  })
}


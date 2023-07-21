import { toastMessage, type ToastMessageType } from "./stores";

export function sendToast(message: string, type?: ToastMessageType) {
  toastMessage.set({
    message,
    type: type || "info",
    remainingMs: 5000
  });
}

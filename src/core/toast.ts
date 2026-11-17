import { store } from "./store.js";
import type { AlertOptions, ToastOptions, ToastType } from "./types.js";

export interface ToastApi<S = unknown> {
	(message: string, options?: ToastOptions<S>): string;
	success(message: string, options?: ToastOptions<S>): string;
	error(message: string, options?: ToastOptions<S>): string;
	warning(message: string, options?: ToastOptions<S>): string;
	info(message: string, options?: ToastOptions<S>): string;
	/** Without an id, dismisses every toast. */
	dismiss(id?: string): void;
	alert(options: AlertOptions): string;
}

const create =
	(type: ToastType) =>
	(message: string, options?: ToastOptions): string =>
		store.add(type, message, options);

export const toast: ToastApi = Object.assign(create("default"), {
	success: create("success"),
	error: create("error"),
	warning: create("warning"),
	info: create("info"),
	dismiss: (id?: string) => store.dismiss(id),
	alert: (options: AlertOptions) => store.showAlert(options),
});

import { store } from "./store.js";
import type { ToastOptions, ToastType } from "./types.js";

export interface PromiseMessages<T> {
	loading: string;
	success: string | ((value: T) => string);
	error: string | ((error: unknown) => string);
}

export interface ToastApi<S = unknown> {
	(message: string, options?: ToastOptions<S>): string;
	success(message: string, options?: ToastOptions<S>): string;
	error(message: string, options?: ToastOptions<S>): string;
	warning(message: string, options?: ToastOptions<S>): string;
	info(message: string, options?: ToastOptions<S>): string;
	/** Shows a spinner. Stays until it is updated or dismissed, unless `duration` is set. */
	loading(message: string, options?: ToastOptions<S>): string;
	/**
	 * Shows a loading toast, then updates it to success or error once the promise settles.
	 * `options` apply to the final toast. Returns the same promise.
	 */
	promise<T>(
		promise: Promise<T>,
		messages: PromiseMessages<T>,
		options?: ToastOptions<S>,
	): Promise<T>;
	/** Without an id, dismisses every toast. */
	dismiss(id?: string): void;
}

const create =
	(type: ToastType) =>
	(message: string, options?: ToastOptions): string =>
		store.add(type, message, options);

const loading = (message: string, options?: ToastOptions): string =>
	store.add("loading", message, { ...options, duration: options?.duration ?? Infinity });

function trackPromise<T>(
	promise: Promise<T>,
	messages: PromiseMessages<T>,
	options?: ToastOptions,
): Promise<T> {
	const id = loading(messages.loading, { id: options?.id });
	promise.then(
		(value) => {
			const message =
				typeof messages.success === "function" ? messages.success(value) : messages.success;
			store.add("success", message, { ...options, id });
		},
		(error: unknown) => {
			const message = typeof messages.error === "function" ? messages.error(error) : messages.error;
			store.add("error", message, { ...options, id });
		},
	);
	return promise;
}

export const toast: ToastApi = Object.assign(create("default"), {
	success: create("success"),
	error: create("error"),
	warning: create("warning"),
	info: create("info"),
	loading,
	promise: trackPromise,
	dismiss: (id?: string) => store.dismiss(id),
});

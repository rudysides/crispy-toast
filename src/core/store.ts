import type { ToastData, ToastOptions, ToastType } from "./types.js";

export interface ToasterState {
	toasts: ToastData[];
}

export function createStore() {
	let state: ToasterState = { toasts: [] };
	const listeners = new Set<() => void>();
	let counter = 0;

	function setState(next: ToasterState) {
		state = next;
		listeners.forEach((listener) => listener());
	}

	return {
		getSnapshot: () => state,

		subscribe(listener: () => void) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},

		add(type: ToastType, message: string, options: ToastOptions = {}): string {
			const id = options.id ?? `toast-${++counter}`;
			const existing = state.toasts.find((toast) => toast.id === id);
			const toast: ToastData = {
				...options,
				id,
				type,
				message,
				dismissed: false,
				version: (existing?.version ?? 0) + 1,
			};
			setState({
				...state,
				toasts: existing
					? state.toasts.map((item) => (item.id === id ? toast : item))
					: [toast, ...state.toasts],
			});
			return id;
		},

		/** Starts the exit animation. Without an id, dismisses every toast. */
		dismiss(id?: string) {
			const targets = state.toasts.filter(
				(toast) => !toast.dismissed && (id === undefined || toast.id === id),
			);
			if (targets.length === 0) return;
			setState({
				...state,
				toasts: state.toasts.map((toast) =>
					targets.includes(toast) ? { ...toast, dismissed: true } : toast,
				),
			});
			targets.forEach((toast) => toast.onDismiss?.());
		},

		/** Called by the UI once the exit animation has finished. */
		remove(id: string) {
			if (!state.toasts.some((toast) => toast.id === id && toast.dismissed)) return;
			setState({ ...state, toasts: state.toasts.filter((toast) => toast.id !== id) });
		},
	};
}

export type ToastStore = ReturnType<typeof createStore>;

export const store = createStore();

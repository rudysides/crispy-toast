import { useEffect, useMemo, useSyncExternalStore } from "react";
import { store } from "./store.js";
import { createTimer } from "./timer.js";
import type { ToastData } from "./types.js";

export function useToasterState() {
	return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

/** Dismisses the toast once its duration runs out. Restarts whenever the toast is updated. */
export function useToastTimer(toast: ToastData, defaultDuration: number, paused: boolean) {
	const duration = toast.duration ?? defaultDuration;
	const timer = useMemo(
		() => createTimer(() => store.dismiss(toast.id), duration),
		// oxlint-disable-next-line react-hooks/exhaustive-deps -- toast.version restarts the timer on update
		[toast.id, toast.version, duration],
	);

	useEffect(() => {
		if (paused || toast.dismissed) return;
		timer.resume();
		return () => timer.pause();
	}, [timer, paused, toast.dismissed]);
}

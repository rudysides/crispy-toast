/** A pausable countdown. Nothing runs until `resume()` is called. */
export function createTimer(onExpire: () => void, duration: number) {
	let remaining = duration;
	let startedAt = 0;
	let handle: ReturnType<typeof setTimeout> | undefined;

	return {
		resume() {
			if (handle !== undefined || !Number.isFinite(remaining)) return;
			startedAt = Date.now();
			handle = setTimeout(
				() => {
					handle = undefined;
					remaining = 0;
					onExpire();
				},
				Math.max(0, remaining),
			);
		},

		pause() {
			if (handle === undefined) return;
			clearTimeout(handle);
			handle = undefined;
			remaining -= Date.now() - startedAt;
		},
	};
}

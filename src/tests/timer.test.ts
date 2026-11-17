import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTimer } from "../core/timer.js";

describe("createTimer", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("expires after the duration", () => {
		const onExpire = vi.fn();
		createTimer(onExpire, 1000).resume();
		vi.advanceTimersByTime(999);
		expect(onExpire).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(onExpire).toHaveBeenCalledTimes(1);
	});

	it("continues with the remaining time after a pause", () => {
		const onExpire = vi.fn();
		const timer = createTimer(onExpire, 1000);
		timer.resume();
		vi.advanceTimersByTime(600);
		timer.pause();
		vi.advanceTimersByTime(5000);
		expect(onExpire).not.toHaveBeenCalled();
		timer.resume();
		vi.advanceTimersByTime(399);
		expect(onExpire).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(onExpire).toHaveBeenCalledTimes(1);
	});

	it("does not start twice", () => {
		const onExpire = vi.fn();
		const timer = createTimer(onExpire, 1000);
		timer.resume();
		timer.resume();
		vi.advanceTimersByTime(1000);
		expect(onExpire).toHaveBeenCalledTimes(1);
	});

	it("never expires with an infinite duration", () => {
		const onExpire = vi.fn();
		createTimer(onExpire, Infinity).resume();
		vi.advanceTimersByTime(1e9);
		expect(onExpire).not.toHaveBeenCalled();
	});
});

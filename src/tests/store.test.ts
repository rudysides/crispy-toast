import { describe, expect, it, vi } from "vitest";
import { createStore, store as sharedStore } from "../core/store.js";
import { toast } from "../core/toast.js";

describe("store", () => {
	it("adds toasts newest first and returns their ids", () => {
		const store = createStore();
		const first = store.add("default", "First");
		const second = store.add("success", "Second");
		expect(store.getSnapshot().toasts.map((t) => t.id)).toEqual([second, first]);
	});

	it("updates a toast with the same id instead of duplicating it", () => {
		const store = createStore();
		store.add("default", "Saving…", { id: "save", description: "Please wait" });
		store.add("success", "Saved", { id: "save" });
		const { toasts } = store.getSnapshot();
		expect(toasts).toHaveLength(1);
		expect(toasts[0]).toMatchObject({ type: "success", message: "Saved", version: 2 });
		expect(toasts[0]?.description).toBeUndefined();
	});

	it("dismisses in two phases and calls onDismiss once", () => {
		const store = createStore();
		const onDismiss = vi.fn();
		const id = store.add("default", "Hello", { onDismiss });
		store.dismiss(id);
		store.dismiss(id);
		expect(store.getSnapshot().toasts[0]?.dismissed).toBe(true);
		expect(onDismiss).toHaveBeenCalledTimes(1);
		store.remove(id);
		expect(store.getSnapshot().toasts).toEqual([]);
	});

	it("does not remove a toast that is not dismissed", () => {
		const store = createStore();
		const id = store.add("default", "Hello");
		store.remove(id);
		expect(store.getSnapshot().toasts).toHaveLength(1);
	});

	it("brings a dismissed toast back when it is added again", () => {
		const store = createStore();
		store.add("default", "Hello", { id: "x" });
		store.dismiss("x");
		store.add("default", "Hello again", { id: "x" });
		expect(store.getSnapshot().toasts[0]?.dismissed).toBe(false);
	});

	it("dismisses every toast when called without an id", () => {
		const store = createStore();
		store.add("default", "One");
		store.add("default", "Two");
		store.dismiss();
		expect(store.getSnapshot().toasts.every((t) => t.dismissed)).toBe(true);
	});

	it("notifies subscribers only on real changes", () => {
		const store = createStore();
		const listener = vi.fn();
		const unsubscribe = store.subscribe(listener);
		const id = store.add("default", "Hello");
		const snapshot = store.getSnapshot();
		store.remove(id); // not dismissed yet: no-op
		store.dismiss("missing");
		expect(store.getSnapshot()).toBe(snapshot);
		expect(listener).toHaveBeenCalledTimes(1);
		unsubscribe();
		store.add("default", "Ignored");
		expect(listener).toHaveBeenCalledTimes(1);
	});
});

describe("toast", () => {
	it("adds typed toasts to the shared store", () => {
		const id = toast.error("Failed", { description: "Try again" });
		expect(sharedStore.getSnapshot().toasts[0]).toMatchObject({
			id,
			type: "error",
			message: "Failed",
			description: "Try again",
		});
		toast.dismiss(id);
		expect(sharedStore.getSnapshot().toasts[0]?.dismissed).toBe(true);
	});

	it("keeps loading toasts until they are updated", () => {
		const id = toast.loading("Saving…");
		expect(sharedStore.getSnapshot().toasts[0]).toMatchObject({
			id,
			type: "loading",
			duration: Infinity,
		});
		toast.loading("Wait", { duration: 1000 });
		expect(sharedStore.getSnapshot().toasts[0]?.duration).toBe(1000);
	});

	it("updates a promise toast to success with the resolved value", async () => {
		const promise = Promise.resolve(3);
		const result = toast.promise(promise, {
			loading: "Uploading…",
			success: (count) => `${count} files uploaded`,
			error: "Upload failed",
		});
		const id = sharedStore.getSnapshot().toasts[0]?.id;
		expect(sharedStore.getSnapshot().toasts[0]).toMatchObject({
			type: "loading",
			message: "Uploading…",
		});
		expect(result).toBe(promise);
		await result;
		expect(sharedStore.getSnapshot().toasts[0]).toMatchObject({
			id,
			type: "success",
			message: "3 files uploaded",
		});
	});

	it("updates a promise toast to error and keeps the rejection for the caller", async () => {
		const promise = Promise.reject(new Error("offline"));
		const result = toast.promise(
			promise,
			{ loading: "Uploading…", success: "Done", error: (error) => (error as Error).message },
			{ id: "upload" },
		);
		await expect(result).rejects.toThrow("offline");
		expect(sharedStore.getSnapshot().toasts.find((t) => t.id === "upload")).toMatchObject({
			type: "error",
			message: "offline",
		});
	});
});

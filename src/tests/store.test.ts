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

	it("queues alerts and defaults to an OK button", () => {
		const store = createStore();
		const first = store.showAlert({ title: "First" });
		store.showAlert({ title: "Second", buttons: [{ text: "Cancel", style: "cancel" }] });
		expect(store.getSnapshot().alerts[0]).toMatchObject({
			title: "First",
			buttons: [{ text: "OK" }],
		});
		store.closeAlert(first);
		expect(store.getSnapshot().alerts.map((a) => a.title)).toEqual(["Second"]);
	});

	it("notifies subscribers only on real changes", () => {
		const store = createStore();
		const listener = vi.fn();
		const unsubscribe = store.subscribe(listener);
		const id = store.add("default", "Hello");
		const snapshot = store.getSnapshot();
		store.remove(id); // not dismissed yet: no-op
		store.closeAlert("missing");
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

	it("opens alerts", () => {
		const id = toast.alert({ title: "Delete?" });
		expect(sharedStore.getSnapshot().alerts.at(-1)?.id).toBe(id);
	});
});

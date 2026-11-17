// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "../core/store.js";
import { Toaster, toast } from "../web/index.js";

// Tells React that state updates in tests are wrapped in act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

const toastElements = () => [...container.querySelectorAll("[data-crispy-toast]")];
const titles = () =>
	toastElements().map((element) => element.querySelector("[data-title]")?.textContent);
const states = () => toastElements().map((element) => element.getAttribute("data-state"));

function render(props: Parameters<typeof Toaster>[0] = {}) {
	act(() => root.render(<Toaster {...props} />));
}

beforeEach(() => {
	vi.useFakeTimers();
	container = document.createElement("div");
	document.body.append(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => {
		store.dismiss();
		store.getSnapshot().toasts.forEach((item) => store.remove(item.id));
		root.unmount();
	});
	container.remove();
	vi.useRealTimers();
});

describe("web Toaster", () => {
	it("renders toasts and updates them by id", () => {
		render();
		act(() => {
			toast("Uploading…", { id: "upload" });
		});
		expect(titles()).toEqual(["Uploading…"]);
		act(() => {
			toast.success("Uploaded", { id: "upload" });
		});
		expect(titles()).toEqual(["Uploaded"]);
		expect(toastElements()[0]?.getAttribute("data-type")).toBe("success");
	});

	it("dismisses on click and calls onPress", () => {
		const onPress = vi.fn();
		render();
		act(() => {
			toast("Hello", { onPress });
		});
		act(() => (toastElements()[0] as HTMLElement).click());
		expect(onPress).toHaveBeenCalledTimes(1);
		expect(states()).toEqual(["closed"]);
	});

	it("runs the action without the toast's onPress", () => {
		const onPress = vi.fn();
		const undo = vi.fn();
		render();
		act(() => {
			toast("Deleted", { onPress, action: { label: "Undo", onPress: undo } });
		});
		const button = container.querySelector<HTMLButtonElement>("[data-action]");
		expect(button?.textContent).toBe("Undo");
		act(() => button?.click());
		expect(undo).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();
		expect(states()).toEqual(["closed"]);
	});

	it("is keyboard accessible and pauses while focused", () => {
		const onPress = vi.fn();
		render({ duration: 1000 });
		act(() => {
			toast("Hello", { onPress });
		});
		const element = toastElements()[0] as HTMLElement;
		expect(element.tabIndex).toBe(0);
		act(() => element.focus());
		act(() => vi.advanceTimersByTime(5000));
		expect(states()).toEqual(["open"]);
		act(() => {
			element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
		});
		expect(onPress).toHaveBeenCalledTimes(1);
		expect(states()).toEqual(["closed"]);
	});

	it("auto-dismisses after the duration and removes after the exit animation", () => {
		render({ duration: 1000 });
		act(() => {
			toast("Bye");
		});
		act(() => vi.advanceTimersByTime(1000));
		expect(states()).toEqual(["closed"]);
		act(() => vi.advanceTimersByTime(1000));
		expect(toastElements()).toHaveLength(0);
	});

	it("only shows visibleToasts, newest first", () => {
		render({ visibleToasts: 2 });
		act(() => {
			toast("One");
			toast("Two");
			toast("Three");
		});
		expect(titles()).toEqual(["Three", "Two"]);
	});

	it("shows a spinner for loading toasts", () => {
		render();
		act(() => {
			toast.loading("Saving…");
		});
		expect(container.querySelector("[data-icon][data-spinner]")).not.toBeNull();
	});
});

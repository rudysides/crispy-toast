import { createElement, forwardRef, memo } from "react";
import { describe, expect, it } from "vitest";
import { isIconComponent, resolveIcon } from "../core/icon.js";
import type { ToastData } from "../core/types.js";

const Mark = () => null;

const toast = (overrides: Partial<ToastData> = {}): ToastData => ({
	id: "t",
	type: "success",
	message: "Saved",
	dismissed: false,
	version: 1,
	...overrides,
});

describe("isIconComponent", () => {
	it("accepts function, memo and forwardRef components", () => {
		expect(isIconComponent(Mark)).toBe(true);
		expect(isIconComponent(memo(Mark))).toBe(true);
		expect(isIconComponent(forwardRef(Mark))).toBe(true);
	});

	it("rejects elements and primitives", () => {
		expect(isIconComponent(createElement(Mark))).toBe(false);
		expect(isIconComponent("★")).toBe(false);
		expect(isIconComponent(null)).toBe(false);
		expect(isIconComponent(undefined)).toBe(false);
	});
});

describe("resolveIcon", () => {
	it("prefers the toast icon over the Toaster icons", () => {
		expect(resolveIcon(toast({ icon: Mark }), { success: "★" })).toBe(Mark);
	});

	it("keeps null so a toast can hide the icon", () => {
		expect(resolveIcon(toast({ icon: null }), { success: Mark })).toBeNull();
	});

	it("falls back to the Toaster icon for the type, then to the built-in glyph", () => {
		expect(resolveIcon(toast(), { success: Mark })).toBe(Mark);
		expect(resolveIcon(toast(), { error: Mark })).toBeUndefined();
		expect(resolveIcon(toast())).toBeUndefined();
	});
});

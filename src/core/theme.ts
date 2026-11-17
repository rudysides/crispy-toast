import type { ToastPosition, ToastType, ToasterColors } from "./types.js";

export const palettes: Record<"light" | "dark", ToasterColors> = {
	light: {
		background: "#FFFFFF",
		text: "#111111",
		muted: "#6B6B6B",
		border: "rgba(0, 0, 0, 0.08)",
		overlay: "rgba(0, 0, 0, 0.4)",
		accent: "#007AFF",
		destructive: "#FF3B30",
		success: "#34C759",
		error: "#FF3B30",
		warning: "#FF9500",
		info: "#007AFF",
	},
	dark: {
		background: "#1C1C1E",
		text: "#F5F5F7",
		muted: "#A1A1A6",
		border: "rgba(255, 255, 255, 0.1)",
		overlay: "rgba(0, 0, 0, 0.6)",
		accent: "#0A84FF",
		destructive: "#FF453A",
		success: "#30D158",
		error: "#FF453A",
		warning: "#FF9F0A",
		info: "#0A84FF",
	},
};

export function resolveColors(
	scheme: "light" | "dark",
	overrides?: Partial<ToasterColors>,
): ToasterColors {
	return { ...palettes[scheme], ...overrides };
}

export const ICON_GLYPHS: Record<Exclude<ToastType, "default">, string> = {
	success: "✓",
	error: "✕",
	warning: "!",
	info: "i",
};

export function parsePosition(position: ToastPosition) {
	const [vertical, horizontal] = position.split("-") as [
		"top" | "bottom",
		"left" | "center" | "right",
	];
	return { vertical, horizontal };
}

export const ENTER_MS = 250;
export const EXIT_MS = 200;

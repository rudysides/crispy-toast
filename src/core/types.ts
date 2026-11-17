import type { ComponentType, ReactNode } from "react";

export type ToastType = "default" | "success" | "error" | "warning" | "info";

export type ToastPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

export type Theme = "light" | "dark" | "system";

/**
 * A component receives `size` and the toast type's `color`, so icon libraries work as-is.
 * An element is rendered unchanged. `null` hides the icon.
 */
export type ToastIcon = ReactNode | ComponentType<{ size: number; color: string }>;

/** Per-type icons that replace the built-in ones. */
export type ToasterIcons = Partial<Record<ToastType, ToastIcon>>;

/** `S` is the platform style type: `StyleProp<ViewStyle>` on native, `CSSProperties` on web. */
export interface ToastOptions<S = unknown> {
	/** Calling `toast()` again with the same id updates the existing toast. */
	id?: string;
	description?: string;
	/** Replaces the built-in icon, e.g. `MarkIcon` or `<MarkIcon />`. `null` hides it. */
	icon?: ToastIcon;
	/** Milliseconds. `Infinity` keeps the toast until it is dismissed. */
	duration?: number;
	style?: S;
	onPress?: () => void;
	onDismiss?: () => void;
}

export interface ToastData<S = unknown> extends ToastOptions<S> {
	id: string;
	type: ToastType;
	message: string;
	/** Set while the exit animation plays, before the toast is removed. */
	dismissed: boolean;
	/** Bumped on every update so the auto-dismiss timer restarts. */
	version: number;
}

export interface AlertButton {
	text: string;
	style?: "default" | "cancel" | "destructive";
	onPress?: () => void;
}

export interface AlertOptions {
	title: string;
	message?: string;
	/** Defaults to a single "OK" button. */
	buttons?: AlertButton[];
}

export interface AlertData extends AlertOptions {
	id: string;
	buttons: AlertButton[];
}

export interface ToasterColors {
	background: string;
	text: string;
	/** Description and alert message text. */
	muted: string;
	border: string;
	/** Backdrop behind the alert. */
	overlay: string;
	/** Default alert buttons. */
	accent: string;
	/** Destructive alert buttons. */
	destructive: string;
	success: string;
	error: string;
	warning: string;
	info: string;
}

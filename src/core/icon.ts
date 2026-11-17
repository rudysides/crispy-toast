import { isValidElement } from "react";
import type { ComponentType } from "react";
import type { ToastData, ToastIcon, ToasterIcons } from "./types.js";

export type IconComponent = ComponentType<{ size: number; color: string }>;

/** Function components plus `memo` and `forwardRef` objects, which most icon libraries export. */
export function isIconComponent(icon: ToastIcon): icon is IconComponent {
	if (typeof icon === "function") return true;
	return typeof icon === "object" && icon !== null && !isValidElement(icon) && "$$typeof" in icon;
}

/** The toast's own icon wins over the Toaster's. `undefined` means the built-in glyph. */
export function resolveIcon(toast: ToastData, icons?: ToasterIcons): ToastIcon | undefined {
	return toast.icon !== undefined ? toast.icon : icons?.[toast.type];
}

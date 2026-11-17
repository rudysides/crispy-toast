"use client";

import type { CSSProperties } from "react";
import { toast as coreToast } from "../core/toast.js";
import type { ToastApi } from "../core/toast.js";
import type { ToastOptions as CoreToastOptions } from "../core/types.js";

export const toast: ToastApi<CSSProperties> = coreToast;
export default toast;

export type ToastOptions = CoreToastOptions<CSSProperties>;

export { Toaster } from "./Toaster.js";
export type { ToasterProps } from "./Toaster.js";
export type { ToastApi } from "../core/toast.js";
export type {
	AlertButton,
	AlertOptions,
	Theme,
	ToastPosition,
	ToastIcon,
	ToastType,
	ToasterColors,
	ToasterIcons,
} from "../core/types.js";

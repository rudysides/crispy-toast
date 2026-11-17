import type { StyleProp, ViewStyle } from "react-native";
import { toast as coreToast } from "../core/toast.js";
import type { ToastApi } from "../core/toast.js";
import type { ToastOptions as CoreToastOptions } from "../core/types.js";

export const toast: ToastApi<StyleProp<ViewStyle>> = coreToast;
export default toast;

export type ToastOptions = CoreToastOptions<StyleProp<ViewStyle>>;

export { Toaster } from "./Toaster.js";
export type { ToasterProps } from "./Toaster.js";
export type { PromiseMessages, ToastApi } from "../core/toast.js";
export type {
	Theme,
	ToastAction,
	ToastPosition,
	ToastIcon,
	ToastType,
	ToasterColors,
	ToasterIcons,
} from "../core/types.js";

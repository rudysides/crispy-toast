import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { useToasterState } from "../core/hooks.js";
import { parsePosition, resolveColors } from "../core/theme.js";
import type {
	Theme,
	ToastData,
	ToastPosition,
	ToasterColors,
	ToasterIcons,
} from "../core/types.js";
// No extension, so Metro picks insets.macos.js / insets.windows.js there and the app
// doesn't need react-native-safe-area-context on desktop.
import { useInsets } from "./insets";
import { ToastItem } from "./ToastItem.js";

export interface ToasterProps {
	position?: ToastPosition;
	/** Default duration in milliseconds. */
	duration?: number;
	visibleToasts?: number;
	/** Distance from the safe area edge. */
	offset?: number;
	theme?: Theme;
	colors?: Partial<ToasterColors>;
	/** Replaces the built-in icon per type, e.g. `{ success: CheckIcon }`. */
	icons?: ToasterIcons;
	/** Applied to every text in toasts, e.g. `{ fontFamily: "Inter" }`. */
	textStyle?: StyleProp<TextStyle>;
	toastStyle?: StyleProp<ViewStyle>;
}

const ALIGN = { left: "flex-start", center: "center", right: "flex-end" } as const;

export function Toaster({
	position = "bottom-center",
	duration = 4000,
	visibleToasts = 3,
	offset = 16,
	theme = "system",
	colors,
	icons,
	textStyle,
	toastStyle,
}: ToasterProps) {
	const { toasts } = useToasterState();
	const systemScheme = useColorScheme();
	const insets = useInsets();
	const scheme = theme === "system" ? (systemScheme === "dark" ? "dark" : "light") : theme;
	const palette = resolveColors(scheme, colors);
	const { vertical, horizontal } = parsePosition(position);

	return (
		<View
			style={[
				styles.container,
				vertical === "top"
					? { top: insets.top + offset }
					: { bottom: insets.bottom + offset, flexDirection: "column-reverse" },
				{ alignItems: ALIGN[horizontal] },
			]}
		>
			{toasts.map((toast, index) => (
				<ToastItem
					key={toast.id}
					// The native `toast` export only accepts native styles.
					toast={toast as ToastData<StyleProp<ViewStyle>>}
					hidden={index >= visibleToasts}
					duration={duration}
					vertical={vertical}
					colors={palette}
					icons={icons}
					textStyle={textStyle}
					toastStyle={toastStyle}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		// `fixed` keeps toasts in view while the page scrolls on react-native-web.
		position: Platform.OS === "web" ? ("fixed" as "absolute") : "absolute",
		left: 0,
		right: 0,
		flexDirection: "column",
		gap: 8,
		paddingHorizontal: 16,
		zIndex: 9999,
		pointerEvents: "box-none",
	},
});

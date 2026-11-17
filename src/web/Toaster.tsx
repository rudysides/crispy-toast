import type { CSSProperties } from "react";
import { useToasterState } from "../core/hooks.js";
import { parsePosition } from "../core/theme.js";
import type {
	Theme,
	ToastData,
	ToastPosition,
	ToasterColors,
	ToasterIcons,
} from "../core/types.js";
import { AlertDialog } from "./AlertDialog.js";
import { CSS, toCssVars } from "./styles.js";
import { ToastItem } from "./ToastItem.js";

export interface ToasterProps {
	position?: ToastPosition;
	/** Default duration in milliseconds. */
	duration?: number;
	visibleToasts?: number;
	/** Distance from the safe area edge, in pixels. */
	offset?: number;
	theme?: Theme;
	colors?: Partial<ToasterColors>;
	/** Replaces the built-in icon per type, e.g. `{ success: CheckIcon }`. */
	icons?: ToasterIcons;
	/** Applied to every text in toasts and alerts. */
	textStyle?: CSSProperties;
	toastStyle?: CSSProperties;
	alertStyle?: CSSProperties;
}

export function Toaster({
	position = "top-center",
	duration = 4000,
	visibleToasts = 3,
	offset = 16,
	theme = "system",
	colors,
	icons,
	textStyle,
	toastStyle,
	alertStyle,
}: ToasterProps) {
	const { toasts, alerts } = useToasterState();
	const { vertical, horizontal } = parsePosition(position);
	const vars = colors ? toCssVars(colors) : undefined;

	return (
		<>
			<style>{CSS}</style>
			<section
				aria-label="Notifications"
				aria-live="polite"
				aria-relevant="additions text"
				aria-atomic="false"
			>
				<ol
					data-crispy-toaster=""
					data-theme={theme}
					data-y={vertical}
					data-x={horizontal}
					style={{ ...vars, "--ct-offset": `${offset}px` } as CSSProperties}
				>
					{toasts.map((toast, index) => (
						<ToastItem
							key={toast.id}
							// The web `toast` export only accepts CSS styles.
							toast={toast as ToastData<CSSProperties>}
							hidden={index >= visibleToasts}
							duration={duration}
							icons={icons}
							textStyle={textStyle}
							toastStyle={toastStyle}
						/>
					))}
				</ol>
			</section>
			<AlertDialog
				alert={alerts[0]}
				theme={theme}
				vars={vars}
				textStyle={textStyle}
				alertStyle={alertStyle}
			/>
		</>
	);
}

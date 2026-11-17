import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useToastTimer } from "../core/hooks.js";
import { store } from "../core/store.js";
import { resolveIcon } from "../core/icon.js";
import { EXIT_MS } from "../core/theme.js";
import type { ToastData, ToasterIcons } from "../core/types.js";
import { Icon } from "./Icon.js";

interface ToastItemProps {
	toast: ToastData<CSSProperties>;
	hidden: boolean;
	duration: number;
	icons?: ToasterIcons;
	textStyle?: CSSProperties;
	toastStyle?: CSSProperties;
}

export function ToastItem({
	toast,
	hidden,
	duration,
	icons,
	textStyle,
	toastStyle,
}: ToastItemProps) {
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);

	useToastTimer(toast, duration, hovered || focused);

	useEffect(() => {
		if (!toast.dismissed) return;
		if (hidden) {
			store.remove(toast.id);
			return;
		}
		// A timeout instead of `transitionend`, which never fires with reduced motion.
		const timeout = setTimeout(() => store.remove(toast.id), EXIT_MS);
		return () => clearTimeout(timeout);
	}, [toast.dismissed, hidden, toast.id]);

	if (hidden) return null;

	const press = () => {
		toast.onPress?.();
		store.dismiss(toast.id);
	};

	return (
		<li
			data-crispy-toast=""
			data-type={toast.type}
			data-state={toast.dismissed ? "closed" : "open"}
			// Focusable so keyboard users can press (Enter, Space) or dismiss (Escape) it.
			tabIndex={0}
			style={{ ...toastStyle, ...toast.style }}
			onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onFocus={() => setFocused(true)}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
			}}
			onClick={press}
			onKeyDown={(event) => {
				if (event.key === "Escape") {
					store.dismiss(toast.id);
				} else if (
					event.target === event.currentTarget &&
					(event.key === "Enter" || event.key === " ")
				) {
					event.preventDefault();
					press();
				}
			}}
		>
			<Icon type={toast.type} icon={resolveIcon(toast, icons)} />
			<div data-content="">
				<div data-title="" style={textStyle}>
					{toast.message}
				</div>
				{toast.description ? (
					<div data-description="" style={textStyle}>
						{toast.description}
					</div>
				) : null}
			</div>
			{toast.action ? (
				<button
					type="button"
					data-action=""
					style={textStyle}
					onClick={(event) => {
						// Keeps the toast's own onPress from firing too.
						event.stopPropagation();
						toast.action?.onPress();
						store.dismiss(toast.id);
					}}
				>
					{toast.action.label}
				</button>
			) : null}
		</li>
	);
}

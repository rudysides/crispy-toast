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

	useToastTimer(toast, duration, hovered);

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

	return (
		<li
			data-crispy-toast=""
			data-type={toast.type}
			data-state={toast.dismissed ? "closed" : "open"}
			style={{ ...toastStyle, ...toast.style }}
			onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onClick={() => {
				toast.onPress?.();
				store.dismiss(toast.id);
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
		</li>
	);
}

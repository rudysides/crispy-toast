import type { ReactNode } from "react";
import { isIconComponent } from "../core/icon.js";
import { ICON_GLYPHS } from "../core/theme.js";
import type { ToastIcon, ToastType } from "../core/types.js";

export function Icon({ type, icon }: { type: ToastType; icon?: ToastIcon }) {
	if (icon === undefined) {
		if (type === "default") return null;
		return (
			<span data-icon="" aria-hidden="true">
				{ICON_GLYPHS[type]}
			</span>
		);
	}
	if (icon === null || typeof icon === "boolean") return null;
	const Custom = isIconComponent(icon) ? icon : undefined;
	return (
		// The wrapper sets the type color, which custom icons pick up through `currentColor`.
		<span data-icon="" data-custom="" aria-hidden="true">
			{Custom ? <Custom size={20} color="currentColor" /> : (icon as ReactNode)}
		</span>
	);
}

import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { store } from "../core/store.js";
import type { AlertButton, AlertData, Theme } from "../core/types.js";

interface AlertDialogProps {
	alert: AlertData | undefined;
	theme: Theme;
	vars: Record<string, string> | undefined;
	textStyle?: CSSProperties;
	alertStyle?: CSSProperties;
}

export function AlertDialog({ alert, theme, vars, textStyle, alertStyle }: AlertDialogProps) {
	const ref = useRef<HTMLDialogElement>(null);
	const titleId = useId();
	const messageId = useId();

	// Keep rendering the last alert while the dialog fades out.
	const [shown, setShown] = useState(alert);
	if (alert && alert !== shown) setShown(alert);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		if (alert && !dialog.open) dialog.showModal();
		if (!alert && dialog.open) dialog.close();
		// Safer default focus for destructive alerts.
		if (alert) dialog.querySelector<HTMLButtonElement>('[data-style="cancel"]')?.focus();
	}, [alert]);

	const press = (button: AlertButton) => {
		// Ignore clicks while the dialog is already fading out.
		if (!alert) return;
		store.closeAlert(alert.id);
		button.onPress?.();
	};

	return (
		<dialog
			ref={ref}
			data-crispy-alert=""
			data-theme={theme}
			role="alertdialog"
			aria-labelledby={titleId}
			aria-describedby={shown?.message ? messageId : undefined}
			style={{ ...vars, ...alertStyle }}
			// Escape behaves like the cancel button, if there is one.
			onCancel={(event) => {
				event.preventDefault();
				const cancel = alert?.buttons.find((button) => button.style === "cancel");
				if (cancel) press(cancel);
			}}
			// The browser can still force-close the dialog (e.g. Escape pressed twice), so sync the store.
			onClose={() => {
				if (alert) store.closeAlert(alert.id);
			}}
		>
			{shown ? (
				<>
					<div data-content="">
						<h2 id={titleId} data-title="" style={textStyle}>
							{shown.title}
						</h2>
						{shown.message ? (
							<p id={messageId} data-message="" style={textStyle}>
								{shown.message}
							</p>
						) : null}
					</div>
					<div data-buttons="" data-horizontal={shown.buttons.length === 2 ? "" : undefined}>
						{shown.buttons.map((button, index) => (
							<button
								key={index}
								type="button"
								data-style={button.style ?? "default"}
								style={textStyle}
								onClick={() => press(button)}
							>
								{button.text}
							</button>
						))}
					</div>
				</>
			) : null}
		</dialog>
	);
}

"use client";

import type { ReactNode } from "react";
import { toast } from "crispy-toast/web";
import { saveAction } from "./actions";

export function Demo() {
	return (
		<>
			<Section title="Toasts">
				<Button label="Default" onClick={() => toast("Hello from Crispy Toast")} />
				<Button
					label="Success"
					onClick={() => toast.success("Saved", { description: "Your changes are safe." })}
				/>
				<Button label="Error" onClick={() => toast.error("Something went wrong")} />
				<Button label="Warning" onClick={() => toast.warning("Battery is low")} />
				<Button label="Info" onClick={() => toast.info("New version available")} />
				<Button
					label="Update by id"
					onClick={() => {
						toast("Uploading…", { id: "upload", duration: Infinity });
						setTimeout(() => toast.success("Uploaded", { id: "upload" }), 1500);
					}}
				/>
				<Button label="Dismiss all" onClick={() => toast.dismiss()} />
			</Section>

			<Section title="Server action">
				<Button
					label="Save on the server"
					onClick={async () => {
						toast("Saving…", { id: "save", duration: Infinity });
						const { savedAt } = await saveAction();
						toast.success("Saved on the server", { id: "save", description: `at ${savedAt}` });
					}}
				/>
			</Section>

			<Section title="Alert">
				<Button
					label="Delete"
					onClick={() =>
						toast.alert({
							title: "Delete photo?",
							message: "This cannot be undone.",
							buttons: [
								{ text: "Cancel", style: "cancel" },
								{ text: "Delete", style: "destructive", onPress: () => toast.success("Deleted") },
							],
						})
					}
				/>
				<Button
					label="OK only"
					onClick={() => toast.alert({ title: "Hello", message: "Just an OK button." })}
				/>
			</Section>
		</>
	);
}

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section style={{ marginBottom: 24 }}>
			<h2 style={{ fontSize: 13, textTransform: "uppercase", color: "#6B6B6B" }}>{title}</h2>
			<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
		</section>
	);
}

function Button({ label, onClick }: { label: string; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				padding: "10px 14px",
				border: "1px solid #DDD",
				borderRadius: 10,
				background: "#FFF",
				color: "#111",
				font: "inherit",
				cursor: "pointer",
			}}
		>
			{label}
		</button>
	);
}

import { useState } from "react";
import type { ReactNode } from "react";
import { Toaster, toast } from "crispy-toast/web";
import type { Theme, ToastPosition } from "crispy-toast/web";

const POSITIONS: ToastPosition[] = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
];
const THEMES: Theme[] = ["system", "light", "dark"];

export function App() {
	const [position, setPosition] = useState<ToastPosition>("top-center");
	const [theme, setTheme] = useState<Theme>("system");
	const [customColors, setCustomColors] = useState(false);

	return (
		<main style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
			<h1>Crispy Toast · web</h1>

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

			<Section title="Position">
				{POSITIONS.map((item) => (
					<Button
						key={item}
						label={item}
						active={item === position}
						onClick={() => setPosition(item)}
					/>
				))}
			</Section>

			<Section title="Theme">
				{THEMES.map((item) => (
					<Button key={item} label={item} active={item === theme} onClick={() => setTheme(item)} />
				))}
				<Button
					label="Custom colors"
					active={customColors}
					onClick={() => setCustomColors((value) => !value)}
				/>
			</Section>

			{/* Tall spacer to check that toasts stay fixed while scrolling. */}
			<div style={{ height: "150vh" }} />

			<Toaster
				position={position}
				theme={theme}
				colors={
					customColors ? { background: "#4F46E5", text: "#FFFFFF", muted: "#E0E7FF" } : undefined
				}
			/>
		</main>
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

function Button({
	label,
	active,
	onClick,
}: {
	label: string;
	active?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				padding: "10px 14px",
				border: "1px solid #DDD",
				borderRadius: 10,
				background: active ? "#111" : "#FFF",
				color: active ? "#FFF" : "#111",
				font: "inherit",
				cursor: "pointer",
			}}
		>
			{label}
		</button>
	);
}

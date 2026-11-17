import { useState } from "react";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Toaster, toast } from "crispy-toast";
import type { Theme, ToastPosition } from "crispy-toast";

const POSITIONS: ToastPosition[] = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
];
const THEMES: Theme[] = ["system", "light", "dark"];

export default function App() {
	const [position, setPosition] = useState<ToastPosition>("bottom-center");
	const [theme, setTheme] = useState<Theme>("system");
	const [customColors, setCustomColors] = useState(false);

	return (
		<View style={styles.screen}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.heading}>Crispy Toast</Text>

				<Section title="Toasts">
					<Button label="Default" onPress={() => toast("Hello from Crispy Toast")} />
					<Button
						label="Success"
						onPress={() => toast.success("Saved", { description: "Your changes are safe." })}
					/>
					<Button label="Error" onPress={() => toast.error("Something went wrong")} />
					<Button label="Warning" onPress={() => toast.warning("Battery is low")} />
					<Button label="Info" onPress={() => toast.info("New version available")} />
					<Button
						label="Update by id"
						onPress={() => {
							toast("Uploading…", { id: "upload", duration: Infinity });
							setTimeout(() => toast.success("Uploaded", { id: "upload" }), 1500);
						}}
					/>
					<Button label="Dismiss all" onPress={() => toast.dismiss()} />
				</Section>

				<Section title="Async">
					<Button label="Loading" onPress={() => toast.loading("Saving…", { id: "save" })} />
					<Button
						label="Promise"
						onPress={() =>
							toast.promise(new Promise<void>((resolve) => setTimeout(() => resolve(), 1500)), {
								loading: "Uploading…",
								success: "Uploaded",
								error: "Upload failed",
							})
						}
					/>
					<Button
						label="Action"
						onPress={() =>
							toast("Photo deleted", {
								action: { label: "Undo", onPress: () => toast.success("Restored") },
							})
						}
					/>
				</Section>

				<Section title="Position">
					{POSITIONS.map((item) => (
						<Button
							key={item}
							label={item}
							active={item === position}
							onPress={() => setPosition(item)}
						/>
					))}
				</Section>

				<Section title="Theme">
					{THEMES.map((item) => (
						<Button
							key={item}
							label={item}
							active={item === theme}
							onPress={() => setTheme(item)}
						/>
					))}
					<Button
						label="Custom colors"
						active={customColors}
						onPress={() => setCustomColors((value) => !value)}
					/>
				</Section>
			</ScrollView>

			<Toaster
				position={position}
				theme={theme}
				colors={
					customColors ? { background: "#4F46E5", text: "#FFFFFF", muted: "#E0E7FF" } : undefined
				}
			/>
		</View>
	);
}

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			<View style={styles.row}>{children}</View>
		</View>
	);
}

function Button({
	label,
	active,
	onPress,
}: {
	label: string;
	active?: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable onPress={onPress} style={[styles.button, active && styles.buttonActive]}>
			<Text style={[styles.buttonText, active && styles.buttonTextActive]}>{label}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#F2F2F7" },
	content: { padding: 16, gap: 24 },
	heading: { fontSize: 28, fontWeight: "700", color: "#111111" },
	section: { gap: 8 },
	sectionTitle: { fontSize: 13, fontWeight: "600", color: "#6B6B6B", textTransform: "uppercase" },
	row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
	button: {
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 10,
		backgroundColor: "#FFFFFF",
	},
	buttonActive: { backgroundColor: "#111111" },
	buttonText: { fontSize: 15, color: "#111111" },
	buttonTextActive: { color: "#FFFFFF" },
});

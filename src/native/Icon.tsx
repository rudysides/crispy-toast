import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { isIconComponent } from "../core/icon.js";
import { ICON_GLYPHS } from "../core/theme.js";
import type { ToastIcon, ToastType, ToasterColors } from "../core/types.js";

export function Icon({
	type,
	icon,
	colors,
}: {
	type: ToastType;
	icon?: ToastIcon;
	colors: ToasterColors;
}) {
	if (icon === undefined) {
		if (type === "default") return null;
		return (
			<View
				accessibilityElementsHidden
				importantForAccessibility="no-hide-descendants"
				style={[styles.icon, styles.badge, { backgroundColor: colors[type] }]}
			>
				<Text allowFontScaling={false} style={styles.glyph}>
					{ICON_GLYPHS[type]}
				</Text>
			</View>
		);
	}
	if (icon === null || typeof icon === "boolean") return null;
	const color = type === "default" ? colors.text : colors[type];
	const Custom = isIconComponent(icon) ? icon : undefined;
	const node = icon as ReactNode;
	return (
		<View
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			style={styles.icon}
		>
			{Custom ? (
				<Custom size={20} color={color} />
			) : typeof node === "string" || typeof node === "number" ? (
				// Bare text must sit inside <Text> on native.
				<Text allowFontScaling={false} style={[styles.text, { color }]}>
					{node}
				</Text>
			) : (
				node
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	icon: {
		width: 22,
		height: 22,
		alignItems: "center",
		justifyContent: "center",
	},
	badge: {
		borderRadius: 11,
	},
	text: {
		fontSize: 18,
		includeFontPadding: false,
	},
	glyph: {
		color: "#FFFFFF",
		fontSize: 13,
		fontWeight: "700",
		includeFontPadding: false,
	},
});

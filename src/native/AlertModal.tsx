import { useEffect, useState } from "react";
import { Animated, Easing, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { store } from "../core/store.js";
import { ENTER_MS } from "../core/theme.js";
import type { AlertButton, AlertData, ToasterColors } from "../core/types.js";

const useNativeDriver = Platform.OS !== "web";
const ORIENTATIONS = [
	"portrait",
	"portrait-upside-down",
	"landscape",
	"landscape-left",
	"landscape-right",
] as const;

interface AlertModalProps {
	alert: AlertData | undefined;
	colors: ToasterColors;
	textStyle?: StyleProp<TextStyle>;
	alertStyle?: StyleProp<ViewStyle>;
}

export function AlertModal({ alert, colors, textStyle, alertStyle }: AlertModalProps) {
	// Keep rendering the last alert while the modal fades out.
	const [shown, setShown] = useState(alert);
	if (alert && alert !== shown) setShown(alert);

	const [scale] = useState(() => new Animated.Value(1));

	useEffect(() => {
		if (!alert) return;
		scale.setValue(1.1);
		Animated.timing(scale, {
			toValue: 1,
			duration: ENTER_MS,
			easing: Easing.out(Easing.cubic),
			useNativeDriver,
		}).start();
		// oxlint-disable-next-line react-hooks/exhaustive-deps -- replay the entrance only for a new alert
	}, [alert?.id, scale]);

	if (!shown) return null;

	const { buttons } = shown;
	const cancel = buttons.find((button) => button.style === "cancel");
	const horizontal = buttons.length === 2;

	const press = (button: AlertButton) => {
		// Ignore taps while the modal is already fading out.
		if (!alert) return;
		store.closeAlert(alert.id);
		button.onPress?.();
	};

	return (
		<Modal
			visible={alert !== undefined}
			transparent
			animationType="fade"
			statusBarTranslucent
			navigationBarTranslucent
			supportedOrientations={ORIENTATIONS}
			// Android back button behaves like the cancel button, if there is one.
			onRequestClose={() => cancel && press(cancel)}
		>
			<View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
				<Animated.View
					accessibilityViewIsModal
					style={[
						styles.card,
						{ backgroundColor: colors.background, transform: [{ scale }] },
						alertStyle,
					]}
				>
					<View style={styles.content}>
						<Text
							accessibilityRole="header"
							style={[styles.title, { color: colors.text }, textStyle]}
						>
							{shown.title}
						</Text>
						{shown.message ? (
							<Text style={[styles.message, { color: colors.muted }, textStyle]}>
								{shown.message}
							</Text>
						) : null}
					</View>
					<View style={horizontal && styles.buttonsRow}>
						{buttons.map((button, index) => (
							<Pressable
								key={index}
								accessibilityRole="button"
								onPress={() => press(button)}
								style={({ pressed }) => [
									styles.button,
									{ borderColor: colors.border },
									horizontal && styles.buttonInRow,
									horizontal && index > 0 && styles.buttonDivider,
									pressed && { backgroundColor: colors.border },
								]}
							>
								<Text
									style={[
										styles.buttonText,
										{ color: button.style === "destructive" ? colors.destructive : colors.accent },
										button.style === "cancel" && styles.cancelText,
										textStyle,
									]}
								>
									{button.text}
								</Text>
							</Pressable>
						))}
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	card: {
		width: 280,
		maxWidth: "100%",
		borderRadius: 14,
		overflow: "hidden",
	},
	content: {
		alignItems: "center",
		gap: 4,
		paddingTop: 20,
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	title: {
		fontSize: 17,
		fontWeight: "600",
		textAlign: "center",
	},
	message: {
		fontSize: 13,
		lineHeight: 18,
		textAlign: "center",
	},
	buttonsRow: {
		flexDirection: "row",
	},
	button: {
		minHeight: 44,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 8,
		borderTopWidth: StyleSheet.hairlineWidth,
	},
	buttonInRow: {
		flex: 1,
	},
	buttonDivider: {
		borderLeftWidth: StyleSheet.hairlineWidth,
	},
	buttonText: {
		fontSize: 17,
	},
	cancelText: {
		fontWeight: "600",
	},
});

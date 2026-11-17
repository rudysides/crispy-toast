import { useEffect, useMemo, useState } from "react";
import {
	AccessibilityInfo,
	Animated,
	Easing,
	PanResponder,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { useToastTimer } from "../core/hooks.js";
import { store } from "../core/store.js";
import { resolveIcon } from "../core/icon.js";
import { ENTER_MS, EXIT_MS } from "../core/theme.js";
import type { ToastData, ToasterColors, ToasterIcons } from "../core/types.js";
import { Icon } from "./Icon.js";

const useNativeDriver = Platform.OS !== "web";
const SWIPE_DISTANCE = 40;
const SWIPE_VELOCITY = 0.5;

interface ToastItemProps {
	toast: ToastData<StyleProp<ViewStyle>>;
	hidden: boolean;
	duration: number;
	vertical: "top" | "bottom";
	colors: ToasterColors;
	icons?: ToasterIcons;
	textStyle?: StyleProp<TextStyle>;
	toastStyle?: StyleProp<ViewStyle>;
}

export function ToastItem({
	toast,
	hidden,
	duration,
	vertical,
	colors,
	icons,
	textStyle,
	toastStyle,
}: ToastItemProps) {
	const [progress] = useState(() => new Animated.Value(0));
	const [drag] = useState(() => new Animated.Value(0));
	// Swiping towards the nearest screen edge dismisses: up for top toasts, down for bottom ones.
	const direction = vertical === "top" ? -1 : 1;

	useToastTimer(toast, duration, false);

	useEffect(() => {
		if (toast.dismissed && hidden) {
			store.remove(toast.id);
			return;
		}
		if (!toast.dismissed) drag.setValue(0);
		Animated.timing(progress, {
			toValue: toast.dismissed ? 0 : 1,
			duration: toast.dismissed ? EXIT_MS : ENTER_MS,
			easing: Easing.out(Easing.cubic),
			useNativeDriver,
		}).start(({ finished }) => {
			if (finished && toast.dismissed) store.remove(toast.id);
		});
	}, [toast.id, toast.dismissed, hidden, progress, drag]);

	useEffect(() => {
		if (Platform.OS !== "ios") return;
		AccessibilityInfo.announceForAccessibility(
			[toast.message, toast.description].filter(Boolean).join(". "),
		);
		// oxlint-disable-next-line react-hooks/exhaustive-deps -- re-announce on every update, even with unchanged text
	}, [toast.version]);

	const panResponder = useMemo(
		() =>
			PanResponder.create({
				onMoveShouldSetPanResponderCapture: (_, gesture) =>
					Math.abs(gesture.dy) > 5 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
				onPanResponderMove: (_, gesture) => {
					// Follow the finger towards the edge, resist the other way.
					drag.setValue(gesture.dy * direction > 0 ? gesture.dy : gesture.dy / 4);
				},
				onPanResponderRelease: (_, gesture) => {
					if (gesture.dy * direction > SWIPE_DISTANCE || gesture.vy * direction > SWIPE_VELOCITY) {
						store.dismiss(toast.id);
					} else {
						Animated.spring(drag, { toValue: 0, useNativeDriver }).start();
					}
				},
				onPanResponderTerminate: () => {
					Animated.spring(drag, { toValue: 0, useNativeDriver }).start();
				},
			}),
		[toast.id, direction, drag],
	);

	const translateY = useMemo(
		() =>
			Animated.add(
				progress.interpolate({ inputRange: [0, 1], outputRange: [24 * direction, 0] }),
				drag,
			),
		[direction, progress, drag],
	);

	if (hidden) return null;

	return (
		<Animated.View
			{...panResponder.panHandlers}
			accessibilityRole="alert"
			accessibilityLiveRegion="polite"
			style={[styles.wrapper, { opacity: progress, transform: [{ translateY }] }]}
		>
			<Pressable
				onPress={() => {
					toast.onPress?.();
					store.dismiss(toast.id);
				}}
				style={[
					styles.toast,
					{ backgroundColor: colors.background, borderColor: colors.border },
					toastStyle,
					toast.style,
				]}
			>
				<Icon type={toast.type} icon={resolveIcon(toast, icons)} colors={colors} />
				<View style={styles.content}>
					<Text style={[styles.title, { color: colors.text }, textStyle]}>{toast.message}</Text>
					{toast.description ? (
						<Text style={[styles.description, { color: colors.muted }, textStyle]}>
							{toast.description}
						</Text>
					) : null}
				</View>
			</Pressable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
		maxWidth: 380,
	},
	toast: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: 14,
		borderWidth: StyleSheet.hairlineWidth,
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
	},
	content: {
		flex: 1,
		gap: 2,
	},
	title: {
		fontSize: 15,
		fontWeight: "600",
	},
	description: {
		fontSize: 13,
		lineHeight: 18,
	},
});

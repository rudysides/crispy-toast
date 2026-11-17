import { useContext } from "react";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

export function useInsets() {
	// Read the context directly so a missing SafeAreaProvider falls back to 0 instead of throwing.
	const insets = useContext(SafeAreaInsetsContext);
	return { top: insets?.top ?? 0, bottom: insets?.bottom ?? 0 };
}

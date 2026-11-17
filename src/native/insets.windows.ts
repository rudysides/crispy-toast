// Desktop windows have no safe area, so react-native-safe-area-context isn't needed on Windows.
export function useInsets() {
	return { top: 0, bottom: 0 };
}

module.exports = {
	dependencies: {
		// Its New Architecture views use UIKit-only APIs and don't build for macOS.
		// The macOS Podfile autolinks through the ios entry, so both are disabled.
		// Toaster only reads its JS context, which falls back to zero insets without a provider.
		"react-native-safe-area-context": { platforms: { ios: null, macos: null } },
	},
};

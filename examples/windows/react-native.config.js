module.exports = {
	dependencies: {
		// It has no Windows implementation.
		// Toaster only reads its JS context, which falls back to zero insets without a provider.
		"react-native-safe-area-context": { platforms: { windows: null } },
	},
};

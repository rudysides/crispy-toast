const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

// crispy-toast is installed from a packed tarball in CI (see .github/workflows/windows.yml),
// so the default resolver is enough.
module.exports = mergeConfig(getDefaultConfig(__dirname), {});

const path = require("path");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const root = path.resolve(__dirname, "../..");

// crispy-toast is linked from the repo root, which has its own React and React Native.
// Resolve these from this app so the bundle has exactly one copy of each.
// @babel/runtime is here because Babel adds helper imports to the linked dist files.
const appModules = ["react", "react-native", "react-native-macos", "@babel/runtime"];

const defaultConfig = getDefaultConfig(__dirname);
// The CLI's resolver redirects react-native to react-native-macos; keep it in the chain.
const cliResolveRequest = defaultConfig.resolver.resolveRequest;

const config = {
	watchFolders: [root],
	resolver: {
		resolveRequest: (context, moduleName, platform) => {
			const fromApp = appModules.some(
				(name) => moduleName === name || moduleName.startsWith(`${name}/`),
			);
			const origin = fromApp
				? { ...context, originModulePath: path.join(__dirname, "index.js") }
				: context;
			return (cliResolveRequest ?? context.resolveRequest)(origin, moduleName, platform);
		},
	},
};

module.exports = mergeConfig(defaultConfig, config);

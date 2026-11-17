import { Platform } from "react-native";

// On react-native-macos, native-driven animations never apply or finish, which leaves toasts
// invisible and never removed. The web has no native driver. Both use the JS driver instead.
export const useNativeDriver = Platform.OS === "ios" || Platform.OS === "android";

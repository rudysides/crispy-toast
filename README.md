<p align="center">
  <img src="docs/logo.svg" alt="Crispy Toast logo" width="160" />
</p>

<h1 align="center">Crispy Toast</h1>

<p align="center">
  Native toasts for every platform.
</p>

> ⚠️ Work in progress — the API may still change before 1.0.

Toasts and iOS-style alerts with **one API everywhere**: iOS, Android and web.
Zero runtime dependencies, no native code (works in Expo Go).

| Import             | Use it in                        | Renders with                                                 |
| ------------------ | -------------------------------- | ------------------------------------------------------------ |
| `crispy-toast`     | React Native / Expo              | `View`, `Text`, `Animated`, `Modal` (iOS, Android, Expo web) |
| `crispy-toast/web` | Next.js, Vite, any React DOM app | HTML, CSS and a native `<dialog>`                            |

## Install

### Expo / React Native

```sh
npx expo install crispy-toast react-native-safe-area-context
```

Every Expo template already includes `react-native-safe-area-context`.

### Next.js / Vite

```sh
npm i crispy-toast
```

No CSS import needed: `<Toaster />` ships its own styles.

## Usage

Render `<Toaster />` once at the root of your app, then call `toast()` from anywhere.

```tsx
// Expo / React Native
import { Toaster, toast } from "crispy-toast";

// Next.js / Vite
import { Toaster, toast } from "crispy-toast/web";

export default function App() {
	return (
		<>
			<YourApp />
			<Toaster position="top-center" />
		</>
	);
}

toast("Hello!");
toast.success("Saved", { description: "Your changes are safe." });
toast.error("Something went wrong");
toast.warning("Battery is low");
toast.info("New version available");
```

In the Next.js App Router, put `<Toaster />` in your root `layout.tsx`. The web entry is already marked `"use client"`.

### Update and dismiss

```ts
// Same id = update the existing toast instead of adding a new one.
toast("Uploading…", { id: "upload", duration: Infinity });
toast.success("Uploaded", { id: "upload" });

toast.dismiss("upload"); // one toast
toast.dismiss(); // all toasts
```

### Alert

An iOS-style alert with a dimmed backdrop. The buttons work like React Native's `Alert.alert`.

```ts
toast.alert({
	title: "Delete photo?",
	message: "This cannot be undone.",
	buttons: [
		{ text: "Cancel", style: "cancel" },
		{ text: "Delete", style: "destructive", onPress: () => deletePhoto() },
	],
});
```

- `destructive` buttons are red and `cancel` buttons are bold.
- Two buttons are shown side by side; three or more are stacked.
- The Android back button and the Escape key on the web press the `cancel` button.
- Tapping the backdrop does nothing, just like on iOS.
- Alerts opened while another one is visible wait in a queue.

## API

### `toast(message, options?)`

Also available as `toast.success`, `toast.error`, `toast.warning` and `toast.info`. Returns the toast id.

| Option        | Type                         | Description                                                       |
| ------------- | ---------------------------- | ----------------------------------------------------------------- |
| `id`          | `string`                     | Reuse an id to update an existing toast.                          |
| `description` | `string`                     | Secondary text below the message.                                 |
| `icon`        | component, element or `null` | Replaces the built-in icon. `null` hides it. See [Icons](#icons). |
| `duration`    | `number`                     | Milliseconds. `Infinity` keeps the toast until dismissed.         |
| `style`       | style object                 | `StyleProp<ViewStyle>` on native, `CSSProperties` on web.         |
| `onPress`     | `() => void`                 | Called when the toast is tapped. Tapping always dismisses it.     |
| `onDismiss`   | `() => void`                 | Called when the toast closes, for any reason.                     |

### `<Toaster />`

| Prop            | Default        | Description                                                                             |
| --------------- | -------------- | --------------------------------------------------------------------------------------- |
| `position`      | `"top-center"` | `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`   |
| `duration`      | `4000`         | Default duration in milliseconds.                                                       |
| `visibleToasts` | `3`            | How many toasts are shown at once.                                                      |
| `offset`        | `16`           | Distance from the safe area edge.                                                       |
| `theme`         | `"system"`     | `light`, `dark` or `system`.                                                            |
| `colors`        | —              | Override any theme color (see below).                                                   |
| `icons`         | —              | Replace the built-in icon per type, e.g. `{ success: CheckIcon }`. See [Icons](#icons). |
| `textStyle`     | —              | Applied to every text, e.g. `{ fontFamily: "Inter" }`.                                  |
| `toastStyle`    | —              | Applied to every toast.                                                                 |
| `alertStyle`    | —              | Applied to the alert card.                                                              |

On phones a toast spans the screen width, so left, center and right look the same. The difference shows on tablets and the web.

### Icons

Use any icon: your own SVG component or one from an icon library. crispy-toast adds no icon dependency.

```tsx
import { Check, X } from "lucide-react"; // or lucide-react-native, @expo/vector-icons, …

toast.success("Saved", { icon: Check }); // component
toast("Uploaded", { icon: <MarkIcon width={18} /> }); // element, rendered as-is
toast.error("Failed", { icon: null }); // no icon

<Toaster icons={{ success: Check, error: X }} />; // app-wide
```

A component receives `size` (20) and `color` (the toast type's color, or `text` for plain toasts), which most icon libraries understand. On the web `color` is `currentColor`. An element gets neither, so set its size and color yourself. A toast's own `icon` overrides `<Toaster icons>`, which overrides the built-in icon.

## Styling

Most apps only need `theme` and a couple of `colors`:

```tsx
<Toaster
	theme="dark"
	colors={{ background: "#4F46E5", text: "#FFFFFF" }}
	textStyle={{ fontFamily: "Inter" }}
/>
```

| Color                                 | Used for                        |
| ------------------------------------- | ------------------------------- |
| `background`                          | Toast and alert background      |
| `text`                                | Titles                          |
| `muted`                               | Descriptions and alert messages |
| `border`                              | Toast border, alert dividers    |
| `overlay`                             | Backdrop behind the alert       |
| `accent`                              | Default alert buttons           |
| `destructive`                         | Destructive alert buttons       |
| `success`, `error`, `warning`, `info` | Icon colors                     |

For anything else, use `toastStyle`, `alertStyle` or a per-toast `style`. Styles are applied in this order, and the last one wins: defaults → theme → `colors` → `<Toaster>` props → per-toast `style`.

**Web only:** every color is also a CSS variable (`--ct-background`, `--ct-text`, …). Every built-in selector has zero specificity, so your own CSS always wins:

```css
[data-crispy-toaster] {
	--ct-background: black;
}
[data-crispy-toast] {
	border-radius: 4px;
}
```

**NativeWind / Uniwind:** the style props are flat, so you can map class names onto them, e.g. `remapProps(Toaster, { toastClassName: "toastStyle" })` in NativeWind v4.

## Development

```sh
pnpm install
pnpm test        # unit tests (store, timer)
pnpm build       # compile to dist/
pnpm dev         # compile in watch mode
```

The `examples/` folder contains demo apps for Expo, macOS, Windows, Vite and Next.js. The local ones use the built `dist/`, so keep `pnpm dev` running while you work:

```sh
pnpm --filter crispy-toast-example-expo ios      # or android, web
pnpm --filter crispy-toast-example-macos macos
pnpm --filter crispy-toast-example-vite dev
pnpm --filter crispy-toast-example-next dev
```

`examples/windows` is built only in CI, because react-native-windows needs Visual Studio. Run the workflow with `gh workflow run windows.yml` and download the screenshot of the running app with `gh run download -n windows-screenshot`.

## License

MIT

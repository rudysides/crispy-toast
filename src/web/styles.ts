import { ENTER_MS, EXIT_MS, ICON_GLYPHS, palettes } from "../core/theme.js";
import type { ToasterColors } from "../core/types.js";

export function toCssVars(colors: Partial<ToasterColors>): Record<string, string> {
	return Object.fromEntries(Object.entries(colors).map(([name, value]) => [`--ct-${name}`, value]));
}

const declarations = (colors: ToasterColors) =>
	Object.entries(toCssVars(colors))
		.map(([name, value]) => `${name}:${value};`)
		.join("");

const themed = (theme: string) => `:where([data-crispy-toaster][data-theme="${theme}"])`;

const ENTER_EASING = "cubic-bezier(0.215, 0.61, 0.355, 1)";

const iconColors = Object.keys(ICON_GLYPHS)
	.map(
		(type) =>
			`:where([data-crispy-toast][data-type="${type}"] [data-icon]){background:var(--ct-${type})}`,
	)
	.join("\n");

const customIconColors = [...Object.keys(ICON_GLYPHS), "loading"]
	.map(
		(type) =>
			`:where([data-crispy-toast][data-type="${type}"] [data-icon][data-custom]){color:var(--ct-${type})}`,
	)
	.join("\n");

// Every selector is wrapped in :where() so any user CSS wins without !important.
export const CSS = `
:where([data-crispy-toaster]){${declarations(palettes.light)}}
${themed("dark")}{${declarations(palettes.dark)}}
@media (prefers-color-scheme: dark){${themed("system")}{${declarations(palettes.dark)}}}

:where([data-crispy-toaster]){position:fixed;z-index:2147483647;left:0;right:0;box-sizing:border-box;display:flex;flex-direction:column;gap:8px;margin:0;padding:0 16px;list-style:none;pointer-events:none}
:where([data-crispy-toaster][data-y="top"]){top:calc(var(--ct-offset) + env(safe-area-inset-top, 0px))}
:where([data-crispy-toaster][data-y="bottom"]){bottom:calc(var(--ct-offset) + env(safe-area-inset-bottom, 0px));flex-direction:column-reverse}
:where([data-crispy-toaster][data-x="left"]){align-items:flex-start}
:where([data-crispy-toaster][data-x="center"]){align-items:center}
:where([data-crispy-toaster][data-x="right"]){align-items:flex-end}

:where([data-crispy-toast]){--ct-from:-24px;box-sizing:border-box;display:flex;align-items:center;gap:12px;width:100%;max-width:380px;padding:14px 16px;border:1px solid var(--ct-border);border-radius:14px;background:var(--ct-background);color:var(--ct-text);box-shadow:0 4px 12px rgba(0,0,0,0.12);cursor:pointer;pointer-events:auto;transition:opacity ${EXIT_MS}ms ease,transform ${ENTER_MS}ms ${ENTER_EASING}}
:where([data-crispy-toaster][data-y="bottom"] [data-crispy-toast]){--ct-from:24px}
:where([data-crispy-toast][data-state="closed"]){opacity:0;transform:translateY(var(--ct-from))}
@starting-style{:where([data-crispy-toast]){opacity:0;transform:translateY(var(--ct-from))}}
:where([data-crispy-toast] [data-icon]){flex:none;display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;color:#fff;font-size:13px;font-weight:700;line-height:1}
${iconColors}
:where([data-crispy-toast] [data-icon][data-custom]){background:none;border-radius:0;color:var(--ct-text);font-size:18px;font-weight:400}
${customIconColors}
:where([data-crispy-toast]:focus-visible){outline:2px solid var(--ct-info);outline-offset:2px}
:where([data-crispy-toast] [data-icon][data-spinner]){box-sizing:border-box;background:none;border:2px solid color-mix(in srgb, var(--ct-loading) 30%, transparent);border-top-color:var(--ct-loading);animation:ct-spin 0.8s linear infinite}
@keyframes ct-spin{to{transform:rotate(360deg)}}
:where([data-crispy-toast] [data-content]){flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
:where([data-crispy-toast] [data-title]){font-size:15px;font-weight:600;line-height:1.35}
:where([data-crispy-toast] [data-description]){font-size:13px;line-height:1.4;color:var(--ct-muted)}
:where([data-crispy-toast] [data-action]){appearance:none;flex:none;margin:0;padding:6px 12px;border:0;border-radius:8px;background:var(--ct-border);color:var(--ct-text);font:inherit;font-size:13px;font-weight:600;cursor:pointer}
:where([data-crispy-toast] [data-action]:hover){background:color-mix(in srgb, var(--ct-text) 13%, transparent)}
:where([data-crispy-toast] [data-action]:focus-visible){outline:2px solid var(--ct-info);outline-offset:2px}

@media (prefers-reduced-motion: reduce){
:where([data-crispy-toast]){transition:none}
:where([data-crispy-toast] [data-icon][data-spinner]){animation-duration:2.4s}
}
`;

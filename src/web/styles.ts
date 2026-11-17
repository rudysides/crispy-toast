import { ENTER_MS, EXIT_MS, ICON_GLYPHS, palettes } from "../core/theme.js";
import type { ToasterColors } from "../core/types.js";

export function toCssVars(colors: Partial<ToasterColors>): Record<string, string> {
	return Object.fromEntries(Object.entries(colors).map(([name, value]) => [`--ct-${name}`, value]));
}

const declarations = (colors: ToasterColors) =>
	Object.entries(toCssVars(colors))
		.map(([name, value]) => `${name}:${value};`)
		.join("");

const themed = (theme: string) =>
	`:where([data-crispy-toaster][data-theme="${theme}"],[data-crispy-alert][data-theme="${theme}"])`;

const ENTER_EASING = "cubic-bezier(0.215, 0.61, 0.355, 1)";

const iconColors = Object.keys(ICON_GLYPHS)
	.map(
		(type) =>
			`:where([data-crispy-toast][data-type="${type}"] [data-icon]){background:var(--ct-${type})}`,
	)
	.join("\n");

const customIconColors = Object.keys(ICON_GLYPHS)
	.map(
		(type) =>
			`:where([data-crispy-toast][data-type="${type}"] [data-icon][data-custom]){color:var(--ct-${type})}`,
	)
	.join("\n");

// Every selector is wrapped in :where() so any user CSS wins without !important.
export const CSS = `
:where([data-crispy-toaster],[data-crispy-alert]){${declarations(palettes.light)}}
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
:where([data-crispy-toast] [data-icon][data-custom]){background:none;border-radius:0;color:var(--ct-text)}
${customIconColors}
:where([data-crispy-toast] [data-content]){display:flex;flex-direction:column;gap:2px;min-width:0}
:where([data-crispy-toast] [data-title]){font-size:15px;font-weight:600;line-height:1.35}
:where([data-crispy-toast] [data-description]){font-size:13px;line-height:1.4;color:var(--ct-muted)}

:where([data-crispy-alert]){box-sizing:border-box;width:min(280px, calc(100vw - 32px));max-width:none;padding:0;border:0;border-radius:14px;overflow:hidden;background:var(--ct-background);color:var(--ct-text);text-align:center;transition:opacity ${EXIT_MS}ms ease,transform ${ENTER_MS}ms ${ENTER_EASING},overlay ${EXIT_MS}ms allow-discrete,display ${EXIT_MS}ms allow-discrete}
:where([data-crispy-alert]:not([open])){opacity:0}
@starting-style{:where([data-crispy-alert][open]){opacity:0;transform:scale(1.1)}}
:where([data-crispy-alert])::backdrop{background:var(--ct-overlay, rgba(0,0,0,0.4));transition:opacity ${EXIT_MS}ms ease,overlay ${EXIT_MS}ms allow-discrete,display ${EXIT_MS}ms allow-discrete}
:where([data-crispy-alert]:not([open]))::backdrop{opacity:0}
@starting-style{:where([data-crispy-alert][open])::backdrop{opacity:0}}
:where([data-crispy-alert] [data-content]){display:flex;flex-direction:column;gap:4px;padding:20px 16px 16px}
:where([data-crispy-alert] [data-title]){margin:0;font-size:17px;font-weight:600;line-height:1.3}
:where([data-crispy-alert] [data-message]){margin:0;font-size:13px;line-height:1.4;color:var(--ct-muted)}
:where([data-crispy-alert] [data-buttons]){display:flex;flex-direction:column}
:where([data-crispy-alert] [data-buttons][data-horizontal]){flex-direction:row}
:where([data-crispy-alert] button){appearance:none;flex:1;min-height:44px;margin:0;padding:0 8px;border:0;border-top:1px solid var(--ct-border);background:none;color:var(--ct-accent);font:inherit;font-size:17px;cursor:pointer}
:where([data-crispy-alert] [data-horizontal] button + button){border-left:1px solid var(--ct-border)}
:where([data-crispy-alert] button:hover,[data-crispy-alert] button:active){background:var(--ct-border)}
:where([data-crispy-alert] button:focus-visible){outline:2px solid var(--ct-accent);outline-offset:-2px}
:where([data-crispy-alert] button[data-style="cancel"]){font-weight:600}
:where([data-crispy-alert] button[data-style="destructive"]){color:var(--ct-destructive)}

@media (prefers-reduced-motion: reduce){
:where([data-crispy-toast],[data-crispy-alert]){transition:none}
:where([data-crispy-alert])::backdrop{transition:none}
}
`;

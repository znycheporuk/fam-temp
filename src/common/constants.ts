import type { IPolyfill } from "~/types";


export const existingSections = [
	"about",
	"admission",
	"study",
	"deanery",
	"information",
] as const;

export const i18nConfig = {
	supportedLngs: ["en", "uk"],
	fallbackLng: "uk",
	defaultNS: "common",
	react: {useSuspense: false},
};

export const breakpoints = {
	sm: 480,
	md: 768,
	lg: 1024,
};

export const mediaQueries = {
	sm: `(max-width: ${breakpoints.sm}px)`,
	md: `(min-width: ${breakpoints.sm + 1}px) and (max-width: ${breakpoints.md}px)`,
	lg: `(min-width: ${breakpoints.md + 1}px) and (max-width: ${breakpoints.lg}px)`,
	xlg: `(min-width: ${breakpoints.lg + 1}px)`,
};

export const isBrowser = typeof document !== "undefined";
export const isDev = !isBrowser && process.env["NODE_ENV"] === "development";

export const polyfills: IPolyfill[] = [
	{
		browsers: {
			"Safari": "17",
			"Mobile Safari": "17",
			"Chrome WebView": "114",
			"Chrome": "114",
			"Chromium": "114",
			"Edge": "114",
			"Android Browser": "114",
		},
		assets: [
			{path: "/polyfills/popover.js", type: "script"},
			{path: "/polyfills/popover.css", type: "stylesheet"},
		],
	},
];

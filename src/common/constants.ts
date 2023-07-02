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

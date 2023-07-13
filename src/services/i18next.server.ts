import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next";
import { i18nConfig } from "~/common/constants";


export const i18next = new RemixI18Next({
	detection: {
		supportedLanguages: i18nConfig.supportedLngs,
		fallbackLanguage: i18nConfig.fallbackLng,
	},
	i18next: {
		...i18nConfig,
		backend: {
			loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
		},
	},
});

i18next.getLocale = async (request) => {
	const url = new URL(request.url);
	return url.pathname.startsWith("/en") ? "en" : "uk";
};

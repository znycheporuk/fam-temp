import type { TLang } from "~/types";


export const getOppositeLanguage = (lang: TLang): TLang => lang === "en" ? "uk" : "en";
export const parseLang = (lang?: string) => lang === "en" ? "en" : "uk";

export const langLink = (lang: string | undefined, path?: string) => {
	lang ||= parseLang(lang);
	path ??= "";

	const slash = path ? path.startsWith("/") ? "" : "/" : "";

	if (["", "/"].includes(path) && lang === "uk") return "/";
	return `/${lang}${slash}${path}`;
};


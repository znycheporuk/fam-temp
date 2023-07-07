import type { TLang } from "~/types";


export const getOppositeLanguage = (lang: TLang): TLang => lang === "en" ? "uk" : "en";
export const parseLang = (lang?: string) => lang === "en" ? "en" : "uk";

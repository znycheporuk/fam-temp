import { NavLink, useLocation, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { cx, langLink, parseLang } from "~/common/utils";
import type { TLang } from "~/types";


export const LanguageSwitcher = () => {
	const {lang} = useParams();
	const {pathname, search} = useLocation();
	const {i18n} = useTranslation();

	const pathnameWithoutLang = pathname.replace(/^\/(en|uk)/, "");
	const ukLink = langLink("uk", pathnameWithoutLang) + search;
	const enLink = langLink("en", pathnameWithoutLang) + search;

	const onLanguageChange = async (lang: TLang) => {
		await i18n.changeLanguage(lang);
	};

	return (
		<span className="language-switcher">
      <NavLink
	      className={cx("language-switcher__link", parseLang(lang) === "uk" && "active")}
	      to={ukLink}
	      lang="uk"
	      hrefLang="uk"
	      aria-label="Посилання на українську версію сайту"
	      onClick={() => onLanguageChange("uk")}
      >
        Укр
      </NavLink>
      <svg width="0.1rem" height="1.3rem" viewBox="0 0 2 30" fill="none">
        <line x1="1" y1="29" x2="0.999999" y2="1" stroke="var(--text-color)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <NavLink
	      className="language-switcher__link"
	      to={enLink}
	      lang="en"
	      hrefLang="en"
	      aria-label="Link to english version of the site"
	      onClick={() => onLanguageChange("en")}
      >
        Eng
      </NavLink>
    </span>
	);
};

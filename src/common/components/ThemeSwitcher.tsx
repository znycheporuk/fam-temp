import { useFetcher, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { themes } from "~/common/constants";
import { useOptimisticTheme } from "~/common/hooks";


export const ThemeSwitcher = () => {
	const {pathname} = useLocation();
	const {t} = useTranslation();
	const currentTheme = useOptimisticTheme();
	const fetcher = useFetcher();

	return (
		<fetcher.Form
			method="POST"
			action={`/actions/theme?redirectTo=${pathname}`}
			aria-label="Color theme switcher"
			className="theme-switcher"
		>
			{themes.map((themeName) => (
				<button key={themeName} aria-pressed={themeName === currentTheme} name="theme" value={themeName}>
					{t(`menu.theme.${themeName}`)}
				</button>
			))}
			<div className="theme-switcher__selected" />
		</fetcher.Form>
	);
};

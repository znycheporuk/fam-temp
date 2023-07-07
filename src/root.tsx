import type { LinksFunction, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { useChangeLanguage } from "remix-i18next";
import { mediaQueries } from "~/common/constants";

import adminStylesUrl from '~/styles/admin/index.css';
import adminStylesMidUrl from '~/styles/admin/index.md.css';
import adminStylesSmallUrl from '~/styles/admin/index.sm.css';
import adminStylesXLargeUrl from '~/styles/admin/index.xlg.css';
import globalStylesUrl from '~/styles/global/global.css';
import globalLargeStylesUrl from '~/styles/global/global.lg.css';
import globalMidStylesUrl from '~/styles/global/global.md.css';
import globalSmallStylesUrl from '~/styles/global/global.sm.css';
import globalXLargeStylesUrl from '~/styles/global/global.xlg.css';
import noMotionStylesUrl from '~/styles/global/nomotion.css';
import style from '~/styles/global/noscript.css';
import type { TLang, TTheme } from '~/types';


export const links: LinksFunction = () => {
	return [
		{rel: 'preload', href: '/fonts/DaysOne.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous'},
		{rel: 'stylesheet', href: globalStylesUrl},
		{rel: 'stylesheet', href: globalSmallStylesUrl, media: mediaQueries.sm},
		{rel: 'stylesheet', href: globalMidStylesUrl, media: mediaQueries.md},
		{rel: 'stylesheet', href: globalLargeStylesUrl, media: mediaQueries.lg},
		{rel: 'stylesheet', href: globalXLargeStylesUrl, media: mediaQueries.xlg},
		{rel: 'stylesheet', href: noMotionStylesUrl, media: '(prefers-reduced-motion: reduce)'},
	];
};


export const loader = async ({params}: LoaderArgs) => {
	const lang = params.lang === "en" ? "en" : "uk";
	return {lang, user: {} as any};
};

export type IRootLoaderData = SerializeFrom<typeof loader>;

export default function App() {
	const {lang} = useLoaderData<typeof loader>();
	useChangeLanguage(lang);
	return (
		<html lang={lang}>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width,initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

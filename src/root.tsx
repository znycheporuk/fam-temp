import type { LinksFunction, LoaderArgs, SerializeFrom, V2_MetaFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Footer, Header, Polyfills } from "~/common/components";
import { mediaQueries } from "~/common/constants";
import { parseLang } from "~/common/utils";
import { getPolyfills } from "~/services/polyfills.server";
import globalStylesUrl from "~/styles/global/global.css";
import globalLargeStylesUrl from "~/styles/global/global.lg.css";
import globalMidStylesUrl from "~/styles/global/global.md.css";
import globalSmallStylesUrl from "~/styles/global/global.sm.css";
import globalXLargeStylesUrl from "~/styles/global/global.xlg.css";
import noMotionStylesUrl from "~/styles/global/nomotion.css";
import type { TTheme } from "~/types";


export const links: LinksFunction = () => {
	return [
		{rel: "preload", href: "/fonts/DaysOne.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous"},
		{rel: "stylesheet", href: globalStylesUrl},
		{rel: "stylesheet", href: globalSmallStylesUrl, media: mediaQueries.sm},
		{rel: "stylesheet", href: globalMidStylesUrl, media: mediaQueries.md},
		{rel: "stylesheet", href: globalLargeStylesUrl, media: mediaQueries.lg},
		{rel: "stylesheet", href: globalXLargeStylesUrl, media: mediaQueries.xlg},
		{rel: "stylesheet", href: noMotionStylesUrl, media: "(prefers-reduced-motion: reduce)"},
	];
};

export const meta: V2_MetaFunction<typeof loader> = () => {
	const {t} = useTranslation();
	return [
		{title: t("FAM")},
	];
};

export const handle = {
	i18n: "common",
};


export const loader = async ({request}: LoaderArgs) => {
	const polyfills = getPolyfills(request);

	return {user: null as any, polyfills, theme: "" as TTheme};
};

export type IRootLoaderData = SerializeFrom<typeof loader>;

export default () => {
	const {polyfills} = useLoaderData<typeof loader>();
	const {lang} = useParams();

	return (
		<html lang={parseLang(lang)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Polyfills assets={polyfills} />
				<Links />
			</head>
			<body>
				<Header />
				<main>
					<Outlet />
				</main>
				<Footer />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

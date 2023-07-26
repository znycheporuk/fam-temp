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
import { useOptimisticTheme } from "~/common/hooks";
import { cx, getTheme, parseLang } from "~/common/utils";
import { db } from "~/drizzle/db.server";
import { getPolyfills } from "~/services/polyfills.server";
import { getUserSession } from "~/services/session.server";
import globalStylesUrl from "~/styles/global/global.css";
import globalLargeStylesUrl from "~/styles/global/global.lg.css";
import globalMidStylesUrl from "~/styles/global/global.md.css";
import globalSmallStylesUrl from "~/styles/global/global.sm.css";
import globalXLargeStylesUrl from "~/styles/global/global.xlg.css";
import noMotionStylesUrl from "~/styles/global/nomotion.css";


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
	const session = await getUserSession(request);
	const polyfills = getPolyfills(request);

	const userId = session.get("userId");
	const user = userId ? db.query.users.findMany({
		where: (user, {eq}) => eq(user.id, userId),
		columns: {password: false, salt: false},
	})[0] : undefined;
	const theme = getTheme(request);
	return {user, polyfills, theme};
};

export type IRootLoaderData = SerializeFrom<typeof loader>;

export default () => {
	const {polyfills} = useLoaderData<typeof loader>();
	const {lang} = useParams();
	const theme = useOptimisticTheme();

	return (
		<html lang={parseLang(lang)} className={cx(theme)}>
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

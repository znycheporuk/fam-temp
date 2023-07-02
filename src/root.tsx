import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { useChangeLanguage } from "remix-i18next";


export const links: LinksFunction = () => [
	...(cssBundleHref ? [{rel: "stylesheet", href: cssBundleHref}] : []),
];

export const loader = async ({params}: LoaderArgs) => {
	const lang = params.lang === "en" ? "en" : "uk";
	return {lang};
};

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

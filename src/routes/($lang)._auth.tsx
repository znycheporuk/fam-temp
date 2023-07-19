import { LinksFunction, LoaderArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { breakpoints } from "~/common/constants";
import { langLink } from "~/common/utils";
import { getUserSession } from "~/services/session.server";
import style from "~/styles/routes/sign.css";
import lgXlgStyle from "~/styles/routes/sign.lg.xlg.css";
import smMdStyle from "~/styles/routes/sign.sm.md.css";


export const links: LinksFunction = () => [
	{rel: "stylesheet", href: style},
	{rel: "stylesheet", href: smMdStyle, media: `(max-width: ${breakpoints.md}px)`},
	{rel: "stylesheet", href: lgXlgStyle, media: `(min-width: ${breakpoints.md + 1}px)`},
];

export const handle = {
	i18n: "authentication",
};

export const loader = async ({params, request}: LoaderArgs) => {
	const session = await getUserSession(request);

	if (session.get("userId")) return redirect(langLink(params.lang));
	return {};
};

export default () => <Outlet />;

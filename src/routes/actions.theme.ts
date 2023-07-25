import { ActionFunction, redirect } from "@remix-run/node";
import { getOppositeTheme, getTheme } from "~/common/utils";
import { getRedirectTo } from "~/common/utils/getRedirectTo";
import { TTheme } from "~/types";


export const action: ActionFunction = async ({request}) => {
	const formData = await request.formData();
	const currentTheme = getTheme(request) || formData.get("theme");


	return redirect(getRedirectTo(request), {
		headers: {
			"Set-Cookie": `theme=${getOppositeTheme(currentTheme as TTheme)}; Path=/; SameSite=Lax`,
		},
	});
};

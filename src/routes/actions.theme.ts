import { ActionFunction, redirect } from "@remix-run/node";
import { getOppositeTheme } from "~/common/utils";
import { getRedirectTo } from "~/common/utils/getRedirectTo";


export const action: ActionFunction = async ({request}) => {
	const formData = await request.formData();

	return redirect(getRedirectTo(request), {
		headers: {
			"Set-Cookie": `theme=${getOppositeTheme(formData.get("theme") as string)}; Path=/; SameSite=Lax`,
		},
	});
};

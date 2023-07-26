import { ActionFunction, redirect } from "@remix-run/node";
import { getRedirectTo } from "~/common/utils/getRedirectTo";


export const action: ActionFunction = async ({request}) => {
	const formData = await request.formData();
await Bun.sleep(2000)
	return redirect(getRedirectTo(request), {
		headers: {
			"Set-Cookie": `theme=${formData.get("theme")}; Path=/; SameSite=Lax`,
		},
	});
};

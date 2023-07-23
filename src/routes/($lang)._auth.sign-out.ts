import { ActionFunction, json, redirect } from "@remix-run/node";
import { langLink } from "~/common/utils";
import { destroySession, getUserSession } from "~/services/session.server";


export const action: ActionFunction = async ({request, params}) => {
	const session = await getUserSession(request);

	const headers = {
		"Set-Cookie": await destroySession(session),
	};

	if (request.url.includes("users") || request.url.includes("archive") || request.url.includes("edit")) {
		return redirect(langLink(params.lang), {headers});
	}
	return json(null, {headers});
};

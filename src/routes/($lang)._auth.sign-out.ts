import { ActionFunction, json, redirect } from "@remix-run/node";
import { langLink } from "~/common/utils";
import { commitSession, getUserSession } from "~/services/session.server";


export const action: ActionFunction = async ({request, params}) => {
	const session = await getUserSession(request);
	session.unset("userId");
	session.unset("isContentManager");
	session.unset("isAdmin");
	session.unset("isSuperAdmin");

	const headers = {
		"Set-Cookie": await commitSession(session),
	};

	if (request.url.includes("users") || request.url.includes("archive") || request.url.includes("edit")) {
		return redirect(langLink(params.lang), {headers});
	}
	return json(null, {headers});
};

import { createCookie, createFileSessionStorage } from "@remix-run/node";


const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
	throw new Error("SESSION_SECRET must be set");
}

const sessionCookie = createCookie("session", {
	secrets: [sessionSecret],
	sameSite: true,
	path: "/",
	maxAge: 60 * 60 * 24 * 30,
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
});

export const {getSession, commitSession, destroySession} = createFileSessionStorage({
	// The root directory where you want to store the files.
	// Make sure it's writable!
	dir: "/sessions",
	cookie: sessionCookie,
});


export function getUserSession(request: Request) {
	return getSession(request.headers.get("Cookie"));
}

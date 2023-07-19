import { broadcastDevReady, createRequestHandler } from "@remix-run/server-runtime";
import { isDev } from "~/common/constants";


const BUILD_PATH = "./build/index.js";
const STATIC_PATH = "./public";

const HOUR_IN_SECONDS = 60 * 60;
const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;
const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;
const YEAR_IN_SECONDS = 365 * DAY_IN_SECONDS;

let build = await import(BUILD_PATH);

if (build.dev) {
	broadcastDevReady(build);
}

Bun.serve({
	async fetch(request) {
		const url = new URL(request.url);
		try {
			const filePath = STATIC_PATH + url.pathname;
			if (await Bun.file(filePath).exists()) {
				const file = Bun.file(filePath);
				return new Response(file, {headers: {"cache-control": generateCacheControlHeader(url.pathname)}});
			}
		} catch {
			console.error("Failed to serve static file", url.pathname);
		}

		build = await import(BUILD_PATH);
		const handler = createRequestHandler(build, process.env.NODE_ENV);

		const loadContext = {};

		return handler(request, loadContext);
	},
	error() {
		return new Response(null, {status: 404});
	},
});

function generateCacheControlHeader(pathname: string) {
	if (["build", "polyfills", "images", "fonts"].some((prefix) => pathname.startsWith(`/${prefix}/`))) {
		return `immutable, max-age=${YEAR_IN_SECONDS}`;
	}
	if (pathname.startsWith("/locales/")) {
		return isDev ? "max-age=0, no-cache, no-store, must-revalidate" : `max-age=${WEEK_IN_SECONDS}, stale-while-revalidate=${DAY_IN_SECONDS}`;
	}
	return `max-age=${HOUR_IN_SECONDS}`;
}

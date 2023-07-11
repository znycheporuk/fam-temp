import { broadcastDevReady, createRequestHandler } from "@remix-run/server-runtime";


const BUILD_PATH = "./build/index.js";
const STATIC_PATH = "./public";

const HOUR_IN_SECONDS = 60 * 60;
const YEAR_IN_SECONDS = 365 * 24 * HOUR_IN_SECONDS;

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
				const maxAge = (url.pathname.startsWith("/build/") || url.pathname.startsWith("/polyfills/")) ? YEAR_IN_SECONDS : HOUR_IN_SECONDS;
				return new Response(file, {headers: {"cache-control": `max-age=${maxAge}`}});
			}
		} catch {
			console.error("Failed to serve static file", url.pathname);
		}

		// add support for `method` query param to support RESTful forms
		const transformMethod = url.searchParams.get("_method");
		if (transformMethod && request.method !== transformMethod && request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) {
			request = new Request(request, {method: transformMethod});
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

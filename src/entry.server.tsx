import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import isBot from "isbot";
import { resolve } from "node:path";
import { renderToReadableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { i18nConfig } from "~/common/constants";
import { i18next } from "~/i18next.server";


const ABORT_DELAY = 5_000;

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	loadContext: AppLoadContext,
) {
	const instance = createInstance();
	const ns = i18next.getRouteNamespaces(remixContext);
	const url = new URL(request.url);

	const lng = url.pathname.startsWith("/en") ? "en" : "uk";
	await instance
		.use(initReactI18next)
		.use(Backend)
		.init({
			...i18nConfig,
			lng,
			ns,
			backend: {loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json")},
		});
	const stream = await renderToReadableStream(
		<I18nextProvider i18n={instance}>
			<RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
		</I18nextProvider>,
		{
			onError(error) {
				responseStatusCode = 500;
			},
		},
	);

	if (isBot(request.headers.get("user-agent"))) {
		await stream.allReady;
	}

	const headers = new Headers(responseHeaders);
	headers.set("Content-Type", "text/html");
	return new Response(stream, {
		headers,
		status: responseStatusCode,
	});
}

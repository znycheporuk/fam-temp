import UaParser from "ua-parser-js";
import { polyfills } from "~/common/constants";
import type { IPolyfillAsset } from "~/types";


const parser = new UaParser();

export const getPolyfills = (req: Request) => {
	parser.setUA(req.headers.get("user-agent") || "");
	const browser = parser.getBrowser();

	return polyfills.reduce((acc, polyfill) => {
		if (!browser || !browser.name || !browser.version) return acc.concat(polyfill.assets);
		if (polyfill.browsers[browser.name] && (browserVersionToNumber(browser.version) >= polyfill.browsers[browser.name]!)) return acc;
		return acc.concat(polyfill.assets);
	}, [] as IPolyfillAsset[]);
};

const browserVersionToNumber = (version: string) => {
	const [major, minor = 0] = version.split(".");

	return Number(`${major}.${minor}`);
};

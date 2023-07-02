/** @type {import('@remix-run/dev').AppConfig} */
export default {
	appDirectory: "src",
	ignoredRouteFiles: ["**/.*"],
	serverModuleFormat: "esm",
	postcss: true,
	future: {
		v2_dev: true,
		v2_errorBoundary: true,
		v2_headers: true,
		v2_meta: true,
		v2_normalizeFormMethod: true,
		v2_routeConvention: true,
	},
};

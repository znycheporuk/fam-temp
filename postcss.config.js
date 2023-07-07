
module.exports = {
	plugins: [
		require("autoprefixer"),
		require("postcss-preset-env")({
			stage: 4,
			features: {
				"nesting-rules": true,
			}
		}),
	],
};
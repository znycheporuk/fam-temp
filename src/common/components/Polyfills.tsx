import type { IPolyfillAsset } from "~/types";


export const Polyfills = ({assets}: {assets: IPolyfillAsset[]}) => {
	return <>{assets.map((asset) => asset.type === "script"
		? <script key={asset.path} src={asset.path} defer />
		: <link key={asset.path} rel="stylesheet" href={asset.path} />,
	)}</>;
};

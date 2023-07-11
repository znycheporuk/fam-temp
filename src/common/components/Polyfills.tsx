import type { IPolyfillAsset } from "~/types";


export const Polyfills = ({assets}: {assets: IPolyfillAsset[]}) => {
	return <>{assets.map((asset) => asset.type === "script"
		? <script src={asset.path} defer />
		: <link rel='stylesheet' href={asset.path} />,
	)}</>;
};

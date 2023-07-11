import type { settings } from "~/common/hooks/useSettingsReducer";


export type InferActionsTypes<T> = T extends {[key: string]: (...args: Array<any>) => infer U} ? U : never

export type TTheme = "light" | "dark" | ""
export type TLang = "en" | "uk"


export interface IArticleCard {
	title: string;
	description: string;
	link: string;
	draft: boolean;
}


export interface ISettings {
	theme: TTheme | "";
}

export type TSettingsAction = InferActionsTypes<typeof settings>
export type TSettingsDispatch = (action: TSettingsAction) => void

export interface IFormikInitialData {
	errors: Record<string, string>;
	values: Record<string, any>;
	touched: Record<string, boolean>;
	forceDisplay: boolean;
}

export interface IFormikContext extends IFormikInitialData {
	isValid: boolean;
	setValue: (name: string, value: any) => void;
	setTouched: (name: string) => void;
	reset: () => void;
	getFieldMeta: (name: string) => ({
		value: any,
		error?: string,
		touched?: boolean,
		forceDisplay: boolean,
	});
}

export interface IPolyfillAsset {type: "script" | "stylesheet", path: string}

export interface IPolyfill {
	/** min version of browser in which feature is supported, and polyfill shouldn't be loaded */
	browsers: Record<string, string>;
	assets: IPolyfillAsset[];
}


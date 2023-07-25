import { InferModel } from "drizzle-orm";
import type { admins, contentManagers, students, teachers, users } from "~/drizzle/schema.server";


export type InferActionsTypes<T> = T extends {[key: string]: (...args: Array<any>) => infer U} ? U : never

export type TTheme = "light" | "dark" | undefined
export type TLang = "en" | "uk"


export interface IArticleCard {
	title: string;
	description: string;
	link: string;
	draft: boolean;
}


export interface IFormInitialData {
	errors: Record<string, string>;
	values: Record<string, any>;
	touched: Record<string, boolean>;
	forceDisplay: boolean;
}

export interface IFormContext extends IFormInitialData {
	isValid: boolean;
	setValue: (name: string, value: any) => void;
	setTouched: (name: string) => void;
	reset: () => void;
	getFieldMeta: (name: string) => ({
		value: any;
		error?: string;
		touched?: boolean;
		forceDisplay: boolean;
		defaultValue?: string | number | boolean;
	});
}

export interface IPolyfillAsset {
	type: "script" | "stylesheet";
	path: string;
}

export interface IPolyfill {
	/** min version of browser in which feature is supported, and polyfill shouldn't be loaded */
	browsers: Record<string, number>;
	assets: IPolyfillAsset[];
}

export type TAdmin = InferModel<typeof admins>
export type TContentManager = InferModel<typeof contentManagers>
export type TStudent = InferModel<typeof students>
export type TTeacher = InferModel<typeof teachers>
export type TUser = InferModel<typeof users> & {
	student?: TStudent | null;
	teacher?: TTeacher | null;
	admin?: TAdmin | null;
	contentManager?: TContentManager | null;
}

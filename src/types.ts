import type { Admin, ContentManager, Student, Teacher, User } from "@prisma/client";


export type InferActionsTypes<T> = T extends {[key: string]: (...args: Array<any>) => infer U} ? U : never

export type TTheme = "light" | "dark" | ""
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

export type TUser = Partial<Omit<User, "createdAt" | "updatedAt">> & {
	createdAt?: string | Date,
	updatedAt?: string | Date,
	student?: Student | null,
	teacher?: Teacher | null,
	admin?: Admin | null,
	contentManager?: ContentManager | null
}

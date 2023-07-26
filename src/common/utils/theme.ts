import { themes } from "~/common/constants";
import { TTheme } from "~/types";


export const getTheme = (request: Request): TTheme => {
	const themeCookie = request.headers.get("Cookie")?.split(";").find((c) => c.trim().startsWith("theme="))?.split("=")[1] || undefined;
	if (themes.includes(themeCookie as string)) return themeCookie as TTheme;
	return undefined;
};
export const getOppositeTheme = (theme?: TTheme | string | null): TTheme => theme === "light" ? "dark" : "light";

import { TTheme } from "~/types";


export const getTheme = (request: Request) => {
	const themeCookie = request.headers.get("Cookie")?.split(";").find((c) => c.trim().startsWith("theme="))?.split("=")[1] || undefined;
	if (["light", "dark"].includes(themeCookie as string)) return themeCookie as TTheme;
	return undefined;
};
export const getOppositeTheme = (theme?: TTheme) => theme === "light" ? "dark" : "light";

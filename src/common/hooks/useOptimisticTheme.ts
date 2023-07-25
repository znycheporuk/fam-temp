import { useFetchers } from "@remix-run/react";
import { useRootLoaderData } from "~/common/hooks/useRootLoaderData";
import { getOppositeTheme } from "~/common/utils";


export const useOptimisticTheme = () => {
	const {theme} = useRootLoaderData();
	const fetchers = useFetchers();
	const themeFetcher = fetchers.find(f => f.submission?.action.startsWith("/actions/theme"));
	return themeFetcher ? (getOppositeTheme(themeFetcher?.formData?.get("theme") as any)) : theme;
};

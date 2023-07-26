import { useFetchers } from "@remix-run/react";
import { useRootLoaderData } from "~/common/hooks/useRootLoaderData";


export const useOptimisticTheme = () => {
	const {theme} = useRootLoaderData();
	const fetchers = useFetchers();
	const themeFetcher = fetchers.find(f => f?.formAction?.startsWith("/actions/theme"));
	return themeFetcher ? (themeFetcher?.formData?.get("theme")) : theme;
};

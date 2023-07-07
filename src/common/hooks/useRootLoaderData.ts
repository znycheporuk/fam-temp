import { useRouteLoaderData } from "react-router";
import type { IRootLoaderData } from "~/root";


export const useRootLoaderData = () => useRouteLoaderData("root") as IRootLoaderData;

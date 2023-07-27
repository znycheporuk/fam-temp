import { V2_ServerRuntimeMetaArgs, V2_ServerRuntimeMetaDescriptor } from "@remix-run/server-runtime/dist/routeModules";
import { isContentManager } from "~/common/utils/roles";


export const getAdminLinks = (matches: V2_ServerRuntimeMetaArgs["matches"], links: V2_ServerRuntimeMetaDescriptor[]) => {
	// @ts-ignore
	const user = matches.find(match => match.id === "root")?.data?.user;
	if (isContentManager(user)) return links;
	return [] as V2_ServerRuntimeMetaDescriptor[];
};

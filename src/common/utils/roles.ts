import type { TUser } from "~/types";


export const isAdmin = (user: Partial<TUser>) => !!user?.admin;
export const isSuperAdmin = (user: Partial<TUser>) => !!user?.admin?.superAdmin;
export const isContentManager = (user: Partial<TUser>) => !!user?.admin || !!user?.contentManager;
export const isTeacher = (user: Partial<TUser>) => !!user?.teacher;

import type { TUser } from "~/types";


export const isAdmin = (user: TUser | null) => !!user?.admin;
export const isSuperAdmin = (user: TUser | null) => !!user?.admin?.superAdmin;
export const isContentManager = (user: TUser | null) => !!user?.admin || !!user?.contentManager;
export const isTeacher = (user: TUser | null) => !!user?.teacher;

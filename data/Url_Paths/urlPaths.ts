import {ProjectType} from "@/types";


export const manageAccountUrlPath = (accountId: string) =>
    `/settings/account/${accountId}`

export const workspaceSettingsMainUrlPath = 'workspaces/settings'

export const projectStatsPageUrlPath = (projectId: string) =>
    `/workspaces/settings/project/stats/${projectId}`

export const projectSettingsMainUrlPath = (projectId: string) =>
    `/workspaces/settings/project/${projectId}`

export const manageMembersPageUrlPath = (userId: string) =>
    `/workspaces/settings/user/${userId}`

export const enterProjectMainPageUrlPath = (projectType: ProjectType, projectId: string) =>
    `/projects/${projectType}/${projectId}`

export const signInPageUrlPath = '/sign-in'

export const mainHomePageUrlPath = '/'
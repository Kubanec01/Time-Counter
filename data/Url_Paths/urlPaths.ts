import {ProjectType} from "@/types";


export const manageAccountUrlPath = (userId: string) =>
    `/settings/account/${userId}`

export const workspaceSettingsMainUrlPath = '/workspaces/settings'

export const projectStatsPageUrlPath = (projectId: string) =>
    `/workspaces/settings/project/stats/${projectId}`

export const projectSettingsMainUrlPath = (projectId: string) =>
    `/workspaces/settings/project/${projectId}`

export const manageMembersPageUrlPath = (userId: string) =>
    `/workspaces/settings/user/${userId}`

export const enterProjectMainPageUrlPath = (projectType: ProjectType, projectId: string) =>
    `/projects/${projectType}/${projectId}`

export const editProjectNamePageUrlPath = (projectId: string) =>
    `/workspaces/settings/project/edit-project-name/${projectId}`

export const editWorkspaceNamePageUrlPath =
    "/workspaces/settings/nameAndPassword/edit-name"

export const editWorkspacePasswordPageUrlPath =
    "/workspaces/settings/nameAndPassword/edit-password"

export const editUserNamePageUrlPath =
    '/settings/account/edit-user-name'

export const editUserPasswordPageUrlPath =
    '/settings/account/edit-user-password'

export const signInPageUrlPath = '/sign-in'

export const mainHomePageUrlPath = '/'
import {ProjectType} from "@/types";


// General
export const signInPageUrlPath = '/sign-in'

export const mainHomePageUrlPath = '/'


// User Account
export const manageAccountUrlPath = (userId: string) => `/settings/account/${userId}`

export const editUserNamePageUrlPath = '/settings/account/edit-user-name'

export const editUserPasswordPageUrlPath = '/settings/account/edit-user-password'


// Workspace
export const editWorkspaceNamePageUrlPath = "/workspaces/settings/nameAndPassword/edit-name"

export const workspaceSettingsMainUrlPath = '/workspaces/settings'

export const manageMembersPageUrlPath = (userId: string) =>
    `/workspaces/settings/user/${userId}`


// Project
export const editWorkspacePasswordPageUrlPath = "/workspaces/settings/nameAndPassword/edit-password"

export const editProjectNamePageUrlPath = (projectId: string) =>
    `/workspaces/settings/project/edit-project-name/${projectId}`

export const editProjectSettingsPageUrlPath = (projectId: string, projectType: string) =>
    `/workspaces/settings/project/${projectId}?type=${projectType}`

export const projectStatsPageUrlPath = (projectId: string) =>
    `/workspaces/settings/project/stats/${projectId}`

export const enterProjectMainPageUrlPath = (projectType: ProjectType, projectId: string) =>
    `/projects/${projectType}/${projectId}`

export const setProjectDeletePageUrlPath = (projectId: string) =>
    `/workspaces/settings/project/delete/${projectId}`
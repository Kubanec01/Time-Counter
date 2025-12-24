import {UserMode} from "@/types";


export function setLocalStorageUserMode(value: UserMode) {
    localStorage.setItem("workingMode", value)
}

export function setLocalStorageWorkspaceId(value: string) {
    localStorage.setItem("workspaceId", value)
}

export function removeLocalStorageWorkspaceIdAndUserMode() {
    localStorage.removeItem("workingMode")
    localStorage.removeItem("workspaceId")
}
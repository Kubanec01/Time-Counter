import {documentNotFound, invalidUserId, sectionNotFound} from "@/messages/errors";
import {getDoc, updateDoc} from "firebase/firestore";
import {Project, Section, UserMode, WorkspaceId} from "@/types";
import {formatSecondsToTimeString, parseTimeStringToSeconds} from "@/features/utilities/time/timeOperations";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";

export const getProjectTotalTime = async (
    userId: string | undefined,
    projectId: string,
    mode: UserMode,
    workspaceId: WorkspaceId,
): Promise<string> => {

    if (!userId) throw new Error(invalidUserId)

    const userRef = getFirestoreTargetRef(userId, mode, workspaceId)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []

    const matchedProject = projects.find(p => p.projectId === projectId)

    if (matchedProject) return matchedProject.totalTime
    else return "00:00:00"

}

export const setProjectTotalTime = async (
    userId: string | undefined,
    sectionId: string,
    projectId: string,
    time: string,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    if (!userId) throw new Error(invalidUserId)
    const userRef = getFirestoreTargetRef(userId, mode, workspaceId)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []
    const sections: Section[] = data.projectsSections || []

    const sectionTime = sections.find(s => s.sectionId === sectionId)
    if (!sectionTime) throw new Error(sectionNotFound)

    const projectTime = parseTimeStringToSeconds(await getProjectTotalTime(userId, projectId, mode, workspaceId))
    const projectTotalTime = projectTime - parseTimeStringToSeconds(sectionTime.time)
    const newTime = parseTimeStringToSeconds(time)

    const newTotalTime = formatSecondsToTimeString(projectTotalTime + newTime)

    const updatedProjects = projects.map(p => {
        if (p.projectId !== projectId) return p

        return {...p, totalTime: newTotalTime}
    })

    await updateDoc(userRef, {projects: updatedProjects})

}

export const setProjectTotalTimeWithoutSectionId = async (
    userId: string | undefined,
    projectId: string,
    time: string,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    if (!userId) throw new Error(invalidUserId)
    const userRef = getFirestoreTargetRef(userId, mode, workspaceId)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []

    const projectTime = parseTimeStringToSeconds(await getProjectTotalTime(userId, projectId, mode, workspaceId))
    const newTime = parseTimeStringToSeconds(time)

    const newTotalTime = formatSecondsToTimeString(projectTime + newTime)

    const updatedProjects = projects.map(p => {
        if (p.projectId !== projectId) return p

        return {...p, totalTime: newTotalTime}
    })

    await updateDoc(userRef, {projects: updatedProjects})

}

export const subtractProjectTotalTime = async (
    userId: string | undefined,
    projectId: string,
    time: string,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {
    if (!userId) throw new Error(invalidUserId)
    const userRef = getFirestoreTargetRef(userId, mode, workspaceId)
    const docSnap = await getDoc(userRef)
    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []

    const projectTime = parseTimeStringToSeconds(await getProjectTotalTime(userId, projectId, mode, workspaceId))

    const newTime = parseTimeStringToSeconds(time)

    const newTotalTime = formatSecondsToTimeString(projectTime - newTime)

    const updatedProjects = projects.map(p => {
        if (p.projectId !== projectId) return p

        return {...p, totalTime: newTotalTime}
    })

    await updateDoc(userRef, {projects: updatedProjects})

}
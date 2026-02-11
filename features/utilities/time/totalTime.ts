import {documentNotFound, invalidUserId, sectionNotFound} from "@/messages/errors";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Project, Section, UserMode, WorkspaceId} from "@/types";
import {formatSecondsToTimeString, parseTimeStringToSeconds} from "@/features/utilities/time/timeOperations";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {db} from "@/app/firebase/config";

export const getProjectTotalTime = async (
    projectId: string,
    workspaceId: WorkspaceId,
): Promise<number> => {

    const userRef = doc(db, "realms", workspaceId)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []

    const matchedProject = projects.find(p => p.projectId === projectId)

    if (matchedProject) return matchedProject.totalTime
    else return 0

}

// export const setProjectTotalTime = async (
//     userId: string | undefined,
//     sectionId: string,
//     projectId: string,
//     time: string,
//     mode: UserMode,
//     workspaceId: WorkspaceId,
// ) => {
//
//     if (!userId) throw new Error(invalidUserId)
//     const userRef = getFirestoreTargetRef(userId, mode, workspaceId)
//     const docSnap = await getDoc(userRef)
//
//     if (!docSnap.exists()) throw new Error(documentNotFound)
//     const data = docSnap.data()
//     const projects: Project[] = data.projects || []
//     const sections: Section[] = data.projectsSections || []
//
//     const sectionTime = sections.find(s => s.sectionId === sectionId)
//     if (!sectionTime) throw new Error(sectionNotFound)
//
//     const projectTime = parseTimeStringToSeconds(await getProjectTotalTime(userId, projectId, mode, workspaceId))
//     const projectTotalTime = projectTime - parseTimeStringToSeconds(sectionTime.time)
//     const newTime = parseTimeStringToSeconds(time)
//
//     const newTotalTime = formatSecondsToTimeString(projectTotalTime + newTime)
//
//     const updatedProjects = projects.map(p => {
//         if (p.projectId !== projectId) return p
//
//         return {...p, totalTime: newTotalTime}
//     })
//
//     await updateDoc(userRef, {projects: updatedProjects})
//
// }

export const updateProjectTotalTime = async (
    projectId: string,
    seconds: number,
    workspaceId: WorkspaceId,
    changes: "increase" | "decrease",
) => {

    const userRef = doc(db, "realms", workspaceId)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []

    let projectTime = await getProjectTotalTime(projectId, workspaceId)

    if (changes === "increase") projectTime += seconds
    else projectTime -= seconds


    const updatedProjects = projects.map(p => {
        if (p.projectId !== projectId) return p

        return {...p, totalTime: projectTime}
    })

    await updateDoc(userRef, {projects: updatedProjects})

}

// export const subtractProjectTotalTime = async (
//     userId: string | undefined,
//     projectId: string,
//     time: string,
//     mode: UserMode,
//     workspaceId: WorkspaceId,
// ) => {
//     if (!userId) throw new Error(invalidUserId)
//     const userRef = getFirestoreTargetRef(userId, mode, workspaceId)
//     const docSnap = await getDoc(userRef)
//     if (!docSnap.exists()) throw new Error(documentNotFound)
//     const data = docSnap.data()
//     const projects: Project[] = data.projects || []
//
//     const projectTime = parseTimeStringToSeconds(await getProjectTotalTime(userId, projectId, mode, workspaceId))
//
//     const newTime = parseTimeStringToSeconds(time)
//
//     const newTotalTime = formatSecondsToTimeString(projectTime - newTime)
//
//     const updatedProjects = projects.map(p => {
//         if (p.projectId !== projectId) return p
//
//         return {...p, totalTime: newTotalTime}
//     })
//
//     await updateDoc(userRef, {projects: updatedProjects})
//
// }
import {documentNotFound, invalidUserId, sectionNotFound} from "@/messages/errors";
import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Project, Section} from "@/types";
import {formatSecondsToTimeString, parseTimeStringToSeconds} from "@/features/hooks/timeOperations";

export const getProjectTotalTime = async (
    userId: string | undefined,
    projectId: string
): Promise<string> => {

    if (!userId) throw new Error(invalidUserId)

    const userRef = doc(db, "realms", userId)
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
    time: string
) => {

    if (!userId) throw new Error(invalidUserId)
    const userRef = doc(db, "realms", userId)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []
    const sections: Section[] = data.projectsSections || []

    const sectionTime = sections.find(s => s.sectionId === sectionId)
    if (!sectionTime) throw new Error(sectionNotFound)

    const projectTime = parseTimeStringToSeconds(await getProjectTotalTime(userId, projectId))
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
    time: string
) => {

    if (!userId) throw new Error(invalidUserId)
    const userRef = doc(db, "realms", userId)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []

    const projectTime = parseTimeStringToSeconds(await getProjectTotalTime(userId, projectId))
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
    time: string
) => {
    if (!userId) throw new Error(invalidUserId)
    const userRef = doc(db, "realms", userId)
    const docSnap = await getDoc(userRef)
    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []

    const projectTime = parseTimeStringToSeconds(await getProjectTotalTime(userId, projectId))
    console.log(projectTime)
    console.log(time)

    const newTime = parseTimeStringToSeconds(time)

    const newTotalTime = formatSecondsToTimeString(projectTime - newTime)

    const updatedProjects = projects.map(p => {
        if (p.projectId !== projectId) return p

        return {...p, totalTime: newTotalTime}
    })

    await updateDoc(userRef, {projects: updatedProjects})

}





































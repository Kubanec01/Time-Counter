import {Project, WorkspaceId} from "@/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";

export const formatTimeUnit = (num: number) => num.toString().padStart(2, '0');

export const parseTimeStringToSeconds = (time: string) => {
    const timeArr = time.split(':').map(Number);
    const [h, m, s] = timeArr
    return (h * 3600 + m * 60 + s)
}

export const formatSecondsToTimeString = (timeSeconds: number) => {
    if (timeSeconds < 0) timeSeconds = 0

    const hour = Math.floor(timeSeconds / 3600)
    const minutes = Math.floor((timeSeconds % 3600) / 60)
    const seconds = timeSeconds % 60

    return `${formatTimeUnit(hour)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`

}

export const formatFloatHoursToSeconds = (hours: number) => hours * 60 * 60

export const secondsToFloatHours = (seconds: number) => Number(Math.round(seconds / 3600 * 4) / 4)

export const formatedTimeToSeconds = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 3600 + m * 60
}

export const formatedTwoTimesDifferenceToSeconds = (fromTime: string, toTime: string) => {

    const totalSec1 = formatedTimeToSeconds(fromTime)
    const totalSec2 = formatedTimeToSeconds(toTime)

    return totalSec2 - totalSec1

}


export const getProjectTotalTime = async (
    projectId: string,
    workspaceId: WorkspaceId,
): Promise<number> => {
    if (workspaceId === "unused") return 0
    const userRef = doc(db, "realms", workspaceId)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const projects: Project[] = data.projects || []

    const matchedProject = projects.find(p => p.projectId === projectId)

    if (matchedProject) return matchedProject.totalTime
    else return 0

}

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
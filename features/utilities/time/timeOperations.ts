import {Project, WorkspaceId} from "@/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";
import {format} from "date-fns";

export const formatTimeUnit = (num: number) => num.toString().padStart(2, '0');

export const formatSecondsToTimeString = (timeSeconds: number) => {
    if (timeSeconds < 0) timeSeconds = 0

    const hour = Math.floor(timeSeconds / 3600)
    const minutes = Math.floor((timeSeconds % 3600) / 60)
    const seconds = timeSeconds % 60

    return `${formatTimeUnit(hour)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`

}

export const formatFloatHoursToSeconds = (hours: number) => hours * 60 * 60

export const formatSecondsToFloatHours = (seconds: number) => Number(Math.round(seconds / 3600 * 4) / 4)

export const formatedTimeToSeconds = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 3600 + m * 60
}

export const formatedTwoTimesDifferenceToSeconds = (fromTime: string, toTime: string) => {

    const totalSec1 = formatedTimeToSeconds(fromTime)
    const totalSec2 = formatedTimeToSeconds(toTime)

    return totalSec2 - totalSec1

}

export const formatDateToMM = (date: Date | string) => format(date, "MM")


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

    const userRef = doc(db, "realms", workspaceId, 'projects', projectId)
    const docSnap = await getDoc(userRef)
    if (!docSnap.exists()) throw new Error(documentNotFound)

    const data = docSnap.data() as Project

    if (changes === 'increase') data.totalTime += seconds
    else data.totalTime -= seconds

    await updateDoc(userRef,
        {totalTime: data.totalTime})
}
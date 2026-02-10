import {Project, TotalTrackedTime, WorkspaceId} from "@/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {formatSecondsToTimeString, parseTimeStringToSeconds} from "@/features/utilities/time/timeOperations";
import {formateDateToYMD} from "@/features/utilities/date/formateDates";
import {db} from "@/app/firebase/config";


export const updateTotalTrackedTime = async (
    userId: string | undefined,
    projectId: string,
    date: string | null,
    seconds: number,
    workspaceId: WorkspaceId,
    changes: "increase" | "decrease",
) => {

    if (!userId) return;

    // Curr Date Variable
    if (date === null) date = formateDateToYMD(new Date())

    const docRef = doc(db, "realms", workspaceId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const projects: Project[] = data.projects
    const project = projects.find(p => p.projectId === projectId);
    if (!project) {
        console.error("Project not found");
        return null
    }
    const trackedTimes = project.totalTrackedTimes ?? []

    const existingTrackedTime = trackedTimes.find(
        t => t.date === date
    )

    let updatedTrackedTimes: TotalTrackedTime[]

    if (existingTrackedTime) {
        updatedTrackedTimes = trackedTimes.map(t => {
            if (t.date !== date) return t

            let updatedTime = 0

            if (changes === "increase") updatedTime = parseTimeStringToSeconds(t.time) + seconds
            else if (changes === "decrease") updatedTime = parseTimeStringToSeconds(t.time) - seconds

            return {
                ...t,
                time: formatSecondsToTimeString(updatedTime),
            }
        })
    } else {
        updatedTrackedTimes = [
            ...trackedTimes,
            {date: date, time: formatSecondsToTimeString(seconds)},
        ]
    }


    const updatedProjects = projects.map((p: Project) => {
        if (p.projectId !== projectId) return p

        return {...p, totalTrackedTimes: updatedTrackedTimes}

    })

    await updateDoc(docRef, {projects: updatedProjects})


}
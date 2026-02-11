import {Project, TotalTrackedTime, WorkspaceId} from "@/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {formateDateToYMD} from "@/features/utilities/date/formateDates";
import {db} from "@/app/firebase/config";


export const updateTotalTrackedTime = async (
    projectId: string,
    date: string | null | undefined,
    seconds: number,
    workspaceId: WorkspaceId,
    changes: "increase" | "decrease",
) => {
    if(date === undefined) return console.error("Date is undefined");

    // Curr Date Variable
    if (date === null) date = formateDateToYMD(new Date())

    const docRef = doc(db, "realms", workspaceId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const projects: Project[] = data.projects
    const project = projects.find(p => p.projectId === projectId);
    if (!project) return console.log("Project not found");

    const trackedTimes = project.totalTrackedTimes ?? []

    const validTrackedTime = trackedTimes.find(
        t => t.date === date
    )

    let updatedTrackedTimes: TotalTrackedTime[]

    if (validTrackedTime) {
        updatedTrackedTimes = trackedTimes.map(t => {
            if (t.date !== date) return t

            let updatedTime = 0

            if (changes === "increase") updatedTime = t.time + seconds
            else if (changes === "decrease") updatedTime = t.time - seconds

            return {
                ...t,
                time: updatedTime,
            }
        })
    } else {
        updatedTrackedTimes = [
            ...trackedTimes,
            {date: date, time: seconds}
        ]
    }


    const updatedProjects = projects.map((p: Project) => {
        if (p.projectId !== projectId) return p

        return {...p, totalTrackedTimes: updatedTrackedTimes}

    })

    await updateDoc(docRef, {projects: updatedProjects})


}
import {Project, TotalTrackedTime, WorkspaceId} from "@/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {projectNotFound} from "@/messages/errors";


export const updateTotalTrackedTime = async (
    projectId: string,
    formatedDateToYMD: string,
    seconds: number,
    workspaceId: WorkspaceId,
    changes: "increase" | "decrease",
) => {

    const docRef = doc(db, "realms", workspaceId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const projects: Project[] = data.projects
    const project = projects.find(p => p.projectId === projectId);
    if (!project) return console.error(projectNotFound);

    const trackedTimes = project.totalTrackedTimes

    const validTrackedTime = trackedTimes.find(
        t => t.date === formatedDateToYMD
    )

    let updatedTrackedTimes: TotalTrackedTime[]

    if (validTrackedTime) {
        updatedTrackedTimes = trackedTimes.map(t => {
            if (t.date !== formatedDateToYMD) return t

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
            {date: formatedDateToYMD, time: seconds}
        ]
    }


    const updatedProjects = projects.map((p: Project) => {
        if (p.projectId !== projectId) return p

        return {...p, totalTrackedTimes: updatedTrackedTimes}

    })

    await updateDoc(docRef, {projects: updatedProjects})


}
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";
import {Project} from "@/types";


export const updateProjectDailyTrackLimit = async (
    workspaceId: string,
    projectId: string,
    limitPeriodType: "daily" | "weekly",
    limitValue: number,
) => {

    const docRef = doc(db, "realms", workspaceId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return console.error(documentNotFound)
    const data = docSnap.data()
    const updatedProjects = data.projects.map((project: Project) => {
        if (project.projectId !== projectId) return project

        if (limitPeriodType === "daily") return {...project, dailyMaxTrackTime: limitValue, weeklyMaxTrackTime: 0}
        else return {...project, weeklyMaxTrackTime: limitValue, dailyMaxTrackTime: 0}
    })

    await updateDoc(docRef, {projects: updatedProjects})


}
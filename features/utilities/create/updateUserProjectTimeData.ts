import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Project} from "@/types";


export const updateUserProjectTimeData = async (
    userId: string | undefined,
    workspaceId: string,
    projectId: string,
    date: string,
    hours: string,
) => {
    if (!userId) return

    const time = Number(hours)

    const docRef = doc(db, "realms", workspaceId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data();
    const projects: Project[] = data.projects
    const currProject: Project = data.projects.find((p: Project) => p.projectId === projectId)
    const membersData = currProject.membersIndividualTimes

    if (membersData[userId]) {
        const currentDayTime = membersData[userId].daily[date] ?? 0
        if (currentDayTime + time > 24) {
            return false
        }
    }

    if (!membersData[userId]) {
        membersData[userId] = {
            daily: {
                [date]: time
            },
            total: time
        }
    } else {
        membersData[userId].daily[date] = (membersData[userId].daily[date] ?? 0) + time
        membersData[userId].total += time
    }

    const updatedProjects = projects.map((p: Project) => {
        if (p.projectId !== projectId) return p

        return {...p, membersIndividualTimes: membersData}
    })

    await updateDoc(docRef, {projects: updatedProjects})
}
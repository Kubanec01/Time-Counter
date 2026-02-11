import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Project} from "@/types";


export const updateUserIndividualTime = async (
    userId: string | undefined,
    workspaceId: string,
    projectId: string,
    date: string,
    seconds: number,
    changes: "increase" | "decrease"
) => {
    if (!userId) return

    const docRef = doc(db, "realms", workspaceId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data();
    const projects: Project[] = data.projects
    const currProject: Project = data.projects.find((p: Project) => p.projectId === projectId)
    const membersData = currProject.membersIndividualTimes

    if (membersData[userId]) {
        const dataTime = membersData[userId].daily[date] ?? 0
        if (dataTime + seconds > 86_400) {
            return false
        }
    }

    if (!membersData[userId]) {
        membersData[userId] = {
            daily: {
                [date]: seconds
            },
            total: seconds
        }
    } else {
        if (changes === "increase") {
            membersData[userId].daily[date] += seconds
            membersData[userId].total += seconds
        } else {
            membersData[userId].daily[date] -= seconds
            membersData[userId].total -= seconds
        }
    }

    const updatedProjects = projects.map((p: Project) => {
        if (p.projectId !== projectId) return p

        return {...p, membersIndividualTimes: membersData}
    })

    await updateDoc(docRef, {projects: updatedProjects})
}
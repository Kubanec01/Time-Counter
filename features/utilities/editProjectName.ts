import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Project} from "@/types";

export const editProjectName = async (
    userId: string | undefined,
    projectId: string | null,
    inputValue: string
) => {

    if (!userId || !projectId) return

    const userRef = doc(db, "realms", userId);
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) return

    const data = userSnap.data();
    const projects: Project[] = data.projects || []

    if (projects) {
        const updatedProjects = projects.map((p: Project) => {
            if (p.projectId !== projectId) return p

            return {...p, title: inputValue}
        })

        await updateDoc(userRef, {projects: updatedProjects})
    }
}
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {projectTasksOptions} from "@/data/users";
import {ProjectWithCustomOptions} from "@/types";


export const createCustomizedTasks = async (userId: string, projectId: string, workspaceId: string) => {
    if (!workspaceId || !userId) return

    const docRef = doc(db, "realms", workspaceId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data()
    const projects = data.projects

    const newUserOptions = {
        userId: userId,
        activeOptions: projectTasksOptions,
        inactiveOptions: [],
    }

    const updatedProjects = projects.map((p: ProjectWithCustomOptions) => {
        if (p.projectId !== projectId) return p

        return {
            ...p,
            customizedUsersOptions: [
                ...(p.customizedUsersOptions || []),
                newUserOptions
            ]
        }

    })

    await updateDoc(docRef, {projects: updatedProjects})
}
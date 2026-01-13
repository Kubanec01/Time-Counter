import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Project, ProjectWithCustomOptions, UserProjectOptions} from "@/types";
import {db} from "@/app/firebase/config";


export const deleteUsersOptionsData = async (
    userId: string,
    projectId: string,
    workspaceId: string,
) => {
    if (!userId) return

    const docRef = doc(db, "realms", workspaceId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data()
    const projects = data.projects || []
    const project = projects.find((p: Project) => p.projectId === projectId)
    const updatedUsersOptions = project.customizedUsersOptions.filter((o: UserProjectOptions) => o.userId !== userId)
    const updatedProjects = projects.map((p: ProjectWithCustomOptions) => {
        if (p.projectId !== projectId) return p
        return {...p, customizedUsersOptions: updatedUsersOptions}
    })

    await updateDoc(docRef, {projects: updatedProjects})
}
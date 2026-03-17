import {
    Project,
    ProjectOption,
    ProjectWithCustomOptions,
    UserMode,
    UserProjectOptions
} from "@/types";


import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {getDoc, updateDoc} from "firebase/firestore";

export const createNewOption = async (
    purpose: "general" | "user",
    userId: string | undefined,
    projectId: string,
    mode: UserMode,
    workspaceId: string,
    newOption: ProjectOption) => {
    if (!userId) return

    const docRef = getFirestoreTargetRef(userId, mode, workspaceId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data()
    const projects = data.projects
    const project = projects.find((p: Project) => p.projectId === projectId)

    if (purpose === "general") {

        const activeOptions = project.options || []

        const updatedOptions = [...activeOptions, newOption]

        // Project
        const updatedProjects = projects.map((p: Project) => {
            if (p.projectId !== projectId) return p
            return {...p, options: updatedOptions}
        })

        await updateDoc(docRef, {projects: updatedProjects})
    } else {
        const activeUserOptions = project.customizedUsersOptions.find((o: UserProjectOptions) => o.userId === userId).activeOptions;

        const updatedUserOptions = [...activeUserOptions, newOption]

        const updatedOptions = project.customizedUsersOptions.map((o: UserProjectOptions) => {
            if (o.userId !== userId) return o

            return {...o, activeOptions: updatedUserOptions}
        })

        // Project
        const updatedProjects = projects.map((p: ProjectWithCustomOptions) => {
            if (p.projectId !== projectId) return p
            return {...p, customizedUsersOptions: updatedOptions}
        })

        await updateDoc(docRef, {projects: updatedProjects})
    }
}
import {Project, ProjectOption, ProjectWithCustomOptions, UserMode, UserProjectOptions} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {getDoc, updateDoc} from "firebase/firestore";


export const setProjectOptionState = async (
    purpose: "user" | "general",
    userId: string | undefined,
    memberId: string,
    projectId: string,
    mode: UserMode,
    workspaceId: string,
    item: ProjectOption,
    action: ("activate" | "deactivate")
) => {
    if (!userId) return

    const docRef = getFirestoreTargetRef(userId, mode, workspaceId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data()
    const projects = data.projects
    const project = projects.find((p: Project) => p.projectId === projectId)
    if (purpose === "general") {

        const activeOptions = project.options || []
        const inactiveOptions = project.inactiveOptions || []

        // Active options
        const updatedActiveOptions = action === "deactivate"
            ?
            activeOptions.filter((o: ProjectOption) => o.value !== item.value)
            :
            [...activeOptions, item]

        // Inactive options
        const updatedInactiveOptions = action === "deactivate"
            ?
            [...inactiveOptions, item]
            :
            inactiveOptions.filter((o: ProjectOption) => o.value !== item.value)

        // Project
        const updatedProjects = projects.map((p: Project) => {
            if (p.projectId !== projectId) return p
            return {...p, options: updatedActiveOptions, inactiveOptions: updatedInactiveOptions}
        })

        // Update Doc
        await updateDoc(docRef, {projects: updatedProjects})
    } else {

        const usersOptions = project.customizedUsersOptions.find((o: UserProjectOptions) => o.userId === memberId)
        const activeOptions = usersOptions.activeOptions || []
        const inactiveOptions = usersOptions.inactiveOptions || []

        // Active options
        const updatedActiveOptions = action === "deactivate"
            ?
            activeOptions.filter((o: ProjectOption) => o.value !== item.value)
            :
            [...activeOptions, item]

        // Inactive options
        const updatedInactiveOptions = action === "deactivate"
            ?
            [...inactiveOptions, item]
            :
            inactiveOptions.filter((o: ProjectOption) => o.value !== item.value)

        const updatedOptions = project.customizedUsersOptions.map((o: UserProjectOptions) => {
            if (o.userId !== memberId) return o

            return {...o, activeOptions: updatedActiveOptions, inactiveOptions: updatedInactiveOptions}

        })

        // Project
        const updatedProjects = projects.map((p: ProjectWithCustomOptions) => {
            if (p.projectId !== projectId) return p

            return {...p, customizedUsersOptions: updatedOptions}
        })

        // Update Doc
        await updateDoc(docRef, {projects: updatedProjects})
    }
}
import {Project, ProjectOption, ProjectWithCustomOptions, UserMode, UserProjectOptions} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";


export const setUserCustomOption = async (
    memberId: string,
    projectId: string,
    mode: UserMode,
    workspaceId: string,
    item: ProjectOption,
    action: ("activate" | "deactivate")) => {

    const docRef = doc(db, "realms", workspaceId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data()
    const projects = data.projects
    const project = data.projects.find((p: Project) => p.projectId === projectId)
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
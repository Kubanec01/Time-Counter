import {getDoc, updateDoc} from "firebase/firestore";
import {Project, UserMode, WorkspaceId} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";

export const editProjectName = async (
    userId: string | undefined,
    projectId: string | null,
    inputValue: string,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    if (!userId || !projectId) return

    const userRef = getFirestoreTargetRef(userId, mode, workspaceId);
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
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Project, Section, TimeCheckout, UpdatedSectionByDate, UserMode, WorkspaceId} from "@/types";
import {db} from "@/app/firebase/config";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";


export const deleteProjectCascade = async (
    userId: string | undefined,
    projectId: string | null,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {


    if (!userId) return
    const userRef = getFirestoreTargetRef(userId, mode, workspaceId)

    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) return

    const userData = docSnap.data()

    // Data
    const projects = userData.projects || []
    const projectsSections = userData.projectsSections || [];
    const timeCheckouts = userData.timeCheckouts || [];
    const sectionsByDates = userData.updatedSectionsByDates || []

    // Updated Data
    const updatedProjects = projects.filter((p: Project) => p.projectId !== projectId);
    const updatedProjectsSections = projectsSections.filter((s: Section) => s.projectId !== projectId);
    const updatedTimeCheckouts = timeCheckouts.filter((t: TimeCheckout) => t.projectId !== projectId);
    const updatedSectionsByDates = sectionsByDates.filter((s: UpdatedSectionByDate) => s.projectId !== projectId);
    await updateDoc(userRef, {
        projects: updatedProjects,
        projectsSections: updatedProjectsSections,
        timeCheckouts: updatedTimeCheckouts,
        updatedSectionsByDates: updatedSectionsByDates
    });
}
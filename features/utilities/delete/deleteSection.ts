import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";
import {Section, UpdatedSectionByDate} from "@/types";
import {updateUserIndividualTime} from "@/features/utilities/create-&-update/updateUserIndividualTime";
import {updateProjectTotalTime} from "@/features/utilities/time/timeOperations";
import {updateTotalDailyTrackedTime} from "@/features/utilities/edit/updateTotalDailyTrackedTime";


export const deleteSection = async (
    userId: string | undefined,
    formatedDateToYMD: string,
    workspaceId: string,
    projectId: string,
    sectionId: string,
) => {

    const workspaceRef = doc(db, 'realms', workspaceId,)
    const workspaceSnap = await getDoc(workspaceRef)

    if (!workspaceSnap.exists()) return console.error(documentNotFound)

    const workspaceData = workspaceSnap.data()

    const projectSection: Section = workspaceData.projectsSections.find((section: Section) => section.sectionId === sectionId)

    await updateUserIndividualTime(userId, workspaceId, projectId, formatedDateToYMD, projectSection.time, 'decrease')
    await updateProjectTotalTime(projectId, projectSection.time, workspaceId, 'decrease')
    await updateTotalDailyTrackedTime(projectId, formatedDateToYMD, projectSection.time, workspaceId, 'decrease')

    const updatedSectionsByDates = workspaceData.updatedSectionsByDates.filter((section: UpdatedSectionByDate) => section.sectionId !== sectionId)
    const updatedProjectsSections = workspaceData.projectsSections.filter((section: Section) => section.sectionId !== sectionId)

    await updateDoc(workspaceRef, {
        updatedSectionsByDates: updatedSectionsByDates,
        projectsSections: updatedProjectsSections
    })
}
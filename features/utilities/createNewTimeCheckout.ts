import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {arrayUnion, updateDoc} from "firebase/firestore";
import {TimeCheckout, UserMode, WorkspaceId} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";


export const createNewTimeCheckout = async (
    userId: string | undefined,
    stopTime: string,
    projectId: string,
    sectionId: string,
    startTime: string,
    clockDifference: string,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    if (!userId) return;
    const date = new Date()
    const randomNum = throwRandomNum(10_000_000).toString()

    const userRef = getFirestoreTargetRef(userId, mode, workspaceId);

    const newTimeCheckout: TimeCheckout = {
        sectionId: sectionId,
        projectId: projectId,
        subSectionId: `subSection_${randomNum}_of_${sectionId}`,
        startTime: startTime,
        stopTime: stopTime,
        clockDifference: clockDifference,
        date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
    };

    await updateDoc(userRef, {timeCheckouts: arrayUnion(newTimeCheckout)});
};
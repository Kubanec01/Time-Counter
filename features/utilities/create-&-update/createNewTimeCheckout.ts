import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {TimeCheckout, WorkspaceId} from "@/types";
import {db} from "@/app/firebase/config";


export const createNewTimeCheckout = async (
    projectId: string,
    sectionId: string,
    formatedDateToYMD: string,
    startTime: string,
    stopTime: string,
    clockTimeDifference: number,
    workspaceId: WorkspaceId,
) => {

    const randomNum = throwRandomNum(10_000_000).toString()

    const userRef = doc(db, "realms", workspaceId);

    const newTimeCheckout: TimeCheckout = {
        sectionId: sectionId,
        projectId: projectId,
        subSectionId: `subSection${randomNum}_of_${sectionId}`,
        startTime: startTime,
        stopTime: stopTime,
        durationTime: clockTimeDifference,
        date: formatedDateToYMD,
    };

    await updateDoc(userRef, {timeCheckouts: arrayUnion(newTimeCheckout)});
};
import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {TimeCheckout} from "@/types";


export const createNewTimeCheckout = async (
    userId: string | undefined,
    stopTime: string,
    projectId: string,
    sectionId: string,
    startTime: string,
    clockDifference: string
) => {

    if (!userId) return;
    const date = new Date()
    const randomNum = throwRandomNum().toString()

    const userRef = doc(db, "users", userId);

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
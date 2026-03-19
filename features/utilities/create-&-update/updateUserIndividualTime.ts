import {db} from "@/app/firebase/config";
import {arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore";
import {Project} from "@/types";
import {documentNotFound} from "@/messages/errors";


export const updateUserIndividualTime = async (
    userId: string | undefined,
    workspaceId: string,
    projectId: string,
    formatedDateToYMD: string,
    seconds: number,
    maxDailyTime: number,
    changes: "increase" | "decrease"
) => {
    if (!userId) return

    const docRef = doc(db, "realms", workspaceId, 'projects', projectId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return console.error(documentNotFound)
    const data = docSnap.data();
    const membersData = data.membersIndividualTimes

    if (membersData[userId]) {
        const dataTime = membersData[userId].daily[formatedDateToYMD] ?? 0
        if (dataTime + seconds > maxDailyTime || seconds > maxDailyTime) {
            return false
        }
    }

    if (!membersData[userId]) {
        membersData[userId] = {
            daily: {
                [formatedDateToYMD]: seconds
            },
            total: seconds
        }
    } else {
        if (changes === "increase") {
            membersData[userId].daily[formatedDateToYMD] += seconds
            membersData[userId].total += seconds
        } else {
            membersData[userId].daily[formatedDateToYMD] -= seconds
            membersData[userId].total -= seconds
        }
    }


    await updateDoc(docRef, {membersIndividualTimes: arrayUnion(membersData)})
}
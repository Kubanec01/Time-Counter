import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {documentNotFound} from "@/messages/errors";


export const updateUserIndividualTime = async (
    userId: string | undefined,
    workspaceId: string,
    projectId: string,
    formatedDateToYMD: string,
    seconds: number,
    changes: "increase" | "decrease"
) => {
    if (!userId) return

    const docRef = doc(db, "realms", workspaceId, 'projects', projectId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return console.error(documentNotFound)
    const data = docSnap.data();
    const membersData = data.membersIndividualTimes

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


    await updateDoc(docRef, {membersIndividualTimes: membersData})
}
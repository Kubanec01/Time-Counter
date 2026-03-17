import {Member} from "@/types";
import {db} from "@/app/firebase/config";
import {doc, setDoc} from "firebase/firestore";


export const createNewMember = async (
    workspaceId: string,
    memberData: Member
) => {

    const docRef = doc(db, "realms", workspaceId, "members", memberData.userId)
    await setDoc(docRef, memberData, {merge: true})
}
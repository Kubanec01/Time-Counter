import {collection, getDocs} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Member} from "@/types";


export const getAllWorkspaceMembers = async (
    workspaceId: string,
) => {

    const membersColl = collection(db, "realms", workspaceId, "members")

    const membersDocs = await getDocs(membersColl)

    return membersDocs.docs.map(doc => doc.data() as Member)
}
import {invalidUserId} from "@/messages/errors";
import {doc, setDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Member} from "@/types";


export const createNewWorkspace = async (
    userId: string | undefined,
    userName: string,
    workspaceName: string,
    workspaceId: string,
    password: string,
) => {
    if (!userId) throw new Error(invalidUserId)

    const docRef = doc(db, "realms", workspaceId)

    const member: Member = {
        userId: userId,
        userName: userName,
        role: "Admin",
    }

    await setDoc(docRef, {
        adminId: userId,
        workSpaceId: workspaceId,
        workspaceName: workspaceName,
        password: password,
        members: [member],
        projects: [],
    })


}
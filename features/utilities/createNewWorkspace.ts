import {documentNotFound, invalidUserId} from "@/messages/errors";
import {doc, getDoc, setDoc} from "firebase/firestore";
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
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) throw new Error(documentNotFound)
    const data = userSnap.data()
    const name: string = data.name
    const surname: string = data.surname


    const member: Member = {
        userId: userId,
        name: name,
        surname: surname,
        role: "Admin",
    }


    const docRef = doc(db, "realms", workspaceId)

    await setDoc(docRef, {
        adminId: userId,
        workSpaceId: workspaceId,
        workspaceName: workspaceName,
        password: password,
        members: [member],
        projects: [],
    })


}
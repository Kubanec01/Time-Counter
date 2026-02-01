import {documentNotFound, invalidUserId} from "@/messages/errors";
import {arrayUnion, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Member, WorkspaceCredentials} from "@/types";
import {setLocalStorageUserMode, setLocalStorageWorkspaceId} from "@/features/utilities/localStorage";
import {usersClasses} from "@/data/users";


export const createNewWorkspace = async (
    userId: string | undefined,
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
    const email: string = data.email


    const member: Member = {
        userId: userId,
        email: email,
        name: name,
        surname: surname,
        role: "Admin",
        class: "unset"
    }

    const docRef = doc(db, "realms", workspaceId)

    const workspaceCredentials: WorkspaceCredentials = {
        workspaceId: workspaceId,
        password: password,
    }

    await setDoc(docRef, {
        adminId: userId,
        workSpaceId: workspaceId,
        workspaceName: workspaceName,
        password: password,
        members: [member],
        projects: [],
        userClasses: usersClasses,
    })

    await updateDoc(userRef, {workspacesList: arrayUnion(workspaceCredentials)},)
    setLocalStorageUserMode("workspace")
    setLocalStorageWorkspaceId(workspaceId)
}
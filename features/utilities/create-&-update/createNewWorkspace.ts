import {documentNotFound, invalidUserId} from "@/messages/errors";
import {arrayUnion, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Member, WorkspaceCredentials} from "@/types";
import {setLocalStorageUserMode, setLocalStorageWorkspaceId} from "@/features/utilities/localStorage";
import {usersClasses} from "@/data/users";
import {createNewMember} from "@/features/utilities/create-&-update/createNewMember";


export const createNewWorkspace = async (
    userId: string | undefined,
    workspaceName: string,
    workspaceId: string,
    password: string,
) => {
    if (!userId) return console.error(invalidUserId)

    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return console.error(documentNotFound)
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

    const projectRef = doc(db, "realms", workspaceId)

    await setDoc(projectRef, {
        adminId: userId,
        workSpaceId: workspaceId,
        workspaceName: workspaceName,
        password: password,
        userClasses: usersClasses,
    })

    await createNewMember(workspaceId, member)

    const workspaceCredentials: WorkspaceCredentials = {
        workspaceId: workspaceId,
        password: password,
    }

    await updateDoc(userRef, {workspacesList: arrayUnion(workspaceCredentials)},)
    setLocalStorageUserMode("workspace")
    setLocalStorageWorkspaceId(workspaceId)
}
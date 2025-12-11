import {invalidUserId} from "@/messages/errors";
import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {doc, setDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {WorkSpace} from "@/types";


export const createNewWorkspace = async (
    userId: string | undefined,
    workspaceName: string,
    password: string,
) => {
    if (!userId) throw new Error(invalidUserId)
    const workspaceId = `${workspaceName.replace(/\s/g, "")}_${throwRandomNum()}`

    const docRef = doc(db, "realms", workspaceId)

    const newWorkspace: WorkSpace = {
        adminId: userId,
        workSpaceId: workspaceId,
        workspaceName: workspaceName,
        password: password,
        members: [],
        projects: [],
    }

    await setDoc(docRef, {newWorkspace})


}
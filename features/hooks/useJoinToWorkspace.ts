import {invalidUserId} from "@/messages/errors";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../app/config/firebase/config";
import {Member} from "@/types";
import {setLocalStorageUserMode, setLocalStorageWorkspaceId} from "@/features/utilities/local-storage/localStorage";
import {useWorkSpaceContext} from "@/features/hooks/context/workspaceContext";


export const useJoinToWorkspace = () => {

    const {setMode, setWorkspaceId} = useWorkSpaceContext()


    const joinToWorkspace = async (
        userId: string | undefined,
        workspaceId: string,
        password: string
    ) => {

        if (!userId) throw new Error(invalidUserId)
        const docRef = doc(db, "realms", workspaceId)
        const userRef = doc(db, "users", userId)

        if (!docRef || !userRef) return console.error("Could not find docRef or userRef")

        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) return
        const data = docSnap.data()
        const correctPassword = data.password
        const blackList: Member[] = data.blackList || []

        if (password !== correctPassword) throw new Error("Wrong edit-password or Id")
        if (blackList.some(member => member.userId === userId)) return console.log("You don't have permission to join this workspace.")
        setLocalStorageUserMode("workspace")
        setLocalStorageWorkspaceId(workspaceId)
        setMode("workspace")
        setWorkspaceId(workspaceId)
    }

        return {joinToWorkspace}

}
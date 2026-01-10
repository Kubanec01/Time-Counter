import {arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Member} from "@/types";


export const removeUser = async (
    memberId: string,
    name: string,
    surname: string,
    email: string,
    workspaceId: string | null
) => {
    if (!workspaceId) return
    const docRef = doc(db, "realms", workspaceId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data()
    const members: Member[] = data.members
    const updatedMembers = members.filter(member => member.userId !== memberId)

    const bannedMember = {
        name: name,
        surname: surname,
        email: email,
        userId: memberId
    }

    await updateDoc(docRef, {members: updatedMembers, blackList: arrayUnion(bannedMember)})
}
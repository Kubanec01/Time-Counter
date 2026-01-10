import {Member, Role} from "@/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";

export const setUserRole = async (
    memberId: string,
    workspaceId: string,
    role: Role,
) => {
    if (!workspaceId) return
    const docRef = doc(db, "realms", workspaceId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data()
    const members: Member[] = data.members || []
    const updatedMembers = members.map((member: Member) => {
        if (member.userId !== memberId) return member
        return {...member, role: role}
    })

    await updateDoc(docRef, {members: updatedMembers})
    console.log("changed")
}
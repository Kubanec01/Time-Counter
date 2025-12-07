import {documentNotFound, invalidUserId} from "@/messages/errors";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Role} from "@/types";


export const getUserRole = async (
    userId: string | undefined
) => {
    if (!userId) throw new Error(invalidUserId)

    const docSnap = await getDoc(doc(db, "realms", userId));
    if (!docSnap.exists()) throw new Error(documentNotFound);
    const data = docSnap.data();
    const userRole: Role = data.role
    if (userRole) return userRole;
}
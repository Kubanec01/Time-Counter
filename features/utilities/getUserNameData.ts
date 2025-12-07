import {documentNotFound, invalidUserId} from "@/messages/errors";
import {db} from "@/app/firebase/config";
import {doc, getDoc} from "firebase/firestore";


export const getUserNameData = async (userId: string | undefined) => {

    if (!userId) throw new Error(invalidUserId)
    const userRef = doc(db, "realms", userId);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data();
    const name = data.name
    const surname = data.surname

    if (name && surname) return {name, surname}
}
import {useEffect, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, getDoc} from "firebase/firestore";
import {documentNotFound} from "@/messages/errors";


export const useGetWorkspacePassword = () => {

    const [password, setPassword] = useState("");
    const {workspaceId} = useWorkSpaceContext()

    useEffect(() => {
        if (workspaceId === "unused") return

        const fetchPassword = async () => {
            const docRef = doc(db, "realms", workspaceId)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) return console.error(documentNotFound)
            const data = docSnap.data()
            setPassword(data.password)
        }
        fetchPassword()
    })

    return {password}

}
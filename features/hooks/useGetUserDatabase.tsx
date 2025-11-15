import {getAuth} from "firebase/auth";
import {db} from "@/app/firebase/config";
import {doc, getDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import {DocumentData, DocumentReference} from "firebase/firestore";

export const useGetUserDatabase = () => {

    const [userData, setUserData] = useState<DocumentData | undefined>()
    const [userRef, setUserRef] = useState<DocumentReference<DocumentData, DocumentData>>()

    const auth = getAuth()
    const userId = auth.currentUser?.uid

    useEffect(() => {

        const fetchData = async () => {
            if (!userId) return

            const userRef = doc(db, "users", userId)
            setUserRef(userRef)
            const userSnap = await getDoc(userRef)
            if (!userSnap) return
            const data = userSnap.data()
            setUserData(data)
        }

        fetchData()
    }, [userId]);

    return {userData, userId, userRef}

}
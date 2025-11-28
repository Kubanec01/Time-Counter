import {getAuth} from "firebase/auth";
import {db} from "@/app/firebase/config";
import {doc, getDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import {DocumentData, DocumentReference} from "firebase/firestore";

export const useGetUserDatabase = () => {

    const [userRef, setUserRef] = useState<DocumentReference<DocumentData, DocumentData>>()

    const auth = getAuth()
    const userId = auth.currentUser?.uid

    useEffect(() => {

        const fetchData = async () => {
            if (!userId) return

            const userRef = doc(db, "users", userId)
            setUserRef(userRef)
        }


        fetchData()
    }, [userId]);

    return {userId, userRef}

}
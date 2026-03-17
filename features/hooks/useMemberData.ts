'use client'

import {useEffect, useState} from "react";
import {Member} from "@/types";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";

export const useMemberData = (
    workspaceId: string,
    userId: string | undefined,
) => {
    const [data, setData] = useState<Member | null>(null)

    useEffect(() => {
        if (!userId || workspaceId === 'unused') return

        const fetchData = async () => {
            const docSnap = await getDoc(doc(db, 'realms', workspaceId, 'members', userId))
            if (!docSnap) return console.error(documentNotFound)
            setData(docSnap.data() as Member)
        }
        fetchData()
    })

    return data
}
'use client'

import {useEffect, useState} from "react";
import {db} from "@/app/firebase/config";
import {doc, DocumentData, getDoc} from "firebase/firestore";
import {documentNotFound} from "@/messages/errors";
import {WorkspaceId} from "@/types";

export const useWorkspaceData = (workspaceId: WorkspaceId) => {

    const [data, setData] = useState<DocumentData | null>(null);


    useEffect(() => {

        if (!workspaceId || workspaceId === 'unused') return


        const fetchData = async () => {
            const docSnap = await getDoc(doc(db, 'realms', workspaceId))
            if (!docSnap.exists()) return console.error(documentNotFound)
            setData(docSnap.data())
        }

        fetchData()

    }, [workspaceId])

    if (data) return data

}
'use client'

import {useEffect, useState} from "react";
import {db} from "@/app/firebase/config";
import {doc, DocumentData,onSnapshot} from "firebase/firestore";
import {documentNotFound} from "@/messages/errors";
import {WorkspaceId} from "@/types";

export const useWorkspaceData = (workspaceId: WorkspaceId) => {

    const [data, setData] = useState<DocumentData | null>(null);


    useEffect(() => {

        if (!workspaceId || workspaceId === 'unused') return

        const docRef = doc(db, "realms", workspaceId);

        const fetchData = onSnapshot(docRef, snap => {
            if (!snap.exists()) return console.error(documentNotFound)
            setData(snap.data())
        })

        return () => fetchData()

    }, [workspaceId])

    if (data) return data

}
'use client'


import {useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Section} from "@/types";

export const useSectionSettings = (
    sectionId: string,
    workspaceId: string,
) => {

    const [value, setValue] = useState<Section | null>(null)

    const docRef = doc(db, "realms", workspaceId)

    useEffect(() => {
        if (workspaceId === 'unset') return

        const fetchData = onSnapshot(docRef, snap => {
            if (!snap.exists()) return

            const data = snap.data();
            const sections = data.projectsSections
            const section = sections.find((s: Section) => s.sectionId === sectionId);
            if (!section) return;
            setValue(section);
        })

        return () => fetchData()

    }, []);

    if (value !== null) return value
}
import React from "react";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Section, WorkspaceId} from "@/types";
import {db} from "@/app/firebase/config";


export const editSectionName = async (
    projectId: string,
    sectionId: string,
    inputValue: string,
    setInputValue: (value: React.SetStateAction<string>) => void,
    setIsEditModalOpen: (value: React.SetStateAction<boolean>) => void,
    workspaceId: WorkspaceId,
) => {

    const userRef = doc(db, "realms", workspaceId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const sections = data.projectsSections || []

    const updatedSections = sections.map((s: Section) => {
        if (s.projectId !== projectId) return s;
        if (s.sectionId !== sectionId) return s;
        return {...s, title: inputValue}
    })
    await updateDoc(userRef, {projectsSections: updatedSections});
    setInputValue("")
    setIsEditModalOpen(false);
}
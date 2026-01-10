import React from "react";
import {getDoc, updateDoc} from "firebase/firestore";
import {Section, UserMode, WorkspaceId} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";


export const editSectionName = async (
    userId: string | undefined,
    projectId: string,
    sectionId: string,
    inputValue: string,
    setInputValue: (value: React.SetStateAction<string>) => void,
    setIsEditModalOpen: (value: React.SetStateAction<boolean>) => void,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    if (!userId) return

    const userRef = getFirestoreTargetRef(userId, mode, workspaceId);
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
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Section, TimeCheckout, WorkspaceId} from "@/types";
import React from "react";
import {db} from "@/app/firebase/config";


export const deleteSubsectionAndTimeCheckoutsData = async (
    subSectionId: string,
    sectionId: string,
    updatedClockTime: number,
    setSubSections: React.Dispatch<React.SetStateAction<[] | TimeCheckout[]>>,
    workspaceId: WorkspaceId,
) => {

    const userRef = doc(db, "realms", workspaceId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const timeCheckouts = data.timeCheckouts || []
    const sections = data.projectsSections || []

    const updatedCheckouts = timeCheckouts.filter((s: TimeCheckout) => s.subSectionId !== subSectionId)
    const updatedSections = sections.map((s: Section) => {
        if (s.sectionId !== sectionId) return s;

        return {...s, time: updatedClockTime}

    })

    await updateDoc(userRef, {timeCheckouts: updatedCheckouts});
    await updateDoc(userRef, {projectsSections: updatedSections})
}


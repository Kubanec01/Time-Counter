import React from "react";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {LoggingType, Section, UpdatedSectionByDate, WorkspaceId} from "@/types";
import {db} from "@/app/firebase/config";

export const createNewSection = async (
    userId: string | undefined,
    userName: string,
    projectId: string,
    inputValue: string,
    time: number,
    formatedDateToYMD: string,
    setInputValue: (value: React.SetStateAction<string>) => void,
    category: LoggingType,
    workspaceId: WorkspaceId,
) => {

    if (inputValue.trim().length < 1) {
        setInputValue("")
        return
    }

    if (!userId) return;
    const userRef = doc(db, "realms", workspaceId,);

    // Random Num Variable
    const randomNum = throwRandomNum(10_000_000).toString()
    const sectionId = `${inputValue.replace(/\s+/g, "")}_${randomNum}`


    const newSection: Section = {
        projectId: projectId,
        sectionId: sectionId,
        userName: userName,
        userId: userId,
        title: inputValue,
        time: time,
        updateDate: formatedDateToYMD,
        category: category
    };

    const newSectionUpdate: UpdatedSectionByDate = {
        projectId: projectId,
        sectionId: sectionId,
        date: formatedDateToYMD,
    }

    await updateDoc(userRef, {projectsSections: arrayUnion(newSection)});
    await updateDoc(userRef, {updatedSectionsByDates: arrayUnion(newSectionUpdate)})
    setInputValue("");
};
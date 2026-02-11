import React from "react";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {LoggingType, Section, UpdatedSectionByDate, WorkspaceId} from "@/types";
import {formateDateToYMD} from "@/features/utilities/date/formateDates";
import {db} from "@/app/firebase/config";

export const createNewSection = async (
    userId: string | undefined,
    userName: string,
    projectId: string,
    inputValue: string,
    time: number,
    date: Date | null,
    setInputValue: (value: React.SetStateAction<string>) => void,
    setIsInfoModalOpen: (value: React.SetStateAction<boolean>) => void,
    category: LoggingType,
    workspaceId: WorkspaceId,
) => {

    if (inputValue.trim().length < 1) {
        setIsInfoModalOpen(true);
        setInputValue("")
        return
    }

    if (!userId) return;
    const userRef = doc(db, "realms", workspaceId);

    // Random Num Variable
    const randomNum = throwRandomNum(10_000_000).toString()
    const sectionId = `${inputValue.replace(/\s+/g, "")}_${randomNum}`


    if (date === null) date = new Date();
    const dateData: string = formateDateToYMD(date)


    const newSection: Section = {
        projectId: projectId,
        sectionId: sectionId,
        userName: userName,
        userId: userId,
        title: inputValue,
        time: time,
        updateDate: dateData,
        category: category
    };

    const newSectionUpdate: UpdatedSectionByDate = {
        projectId: projectId,
        sectionId: sectionId,
        date: dateData,
    }

    await updateDoc(userRef, {projectsSections: arrayUnion(newSection)});
    await updateDoc(userRef, {updatedSectionsByDates: arrayUnion(newSectionUpdate)})
    setInputValue("");
};
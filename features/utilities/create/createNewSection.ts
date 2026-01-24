import React from "react";
import {arrayUnion, updateDoc} from "firebase/firestore";
import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {LoggingType, Section, UpdatedSectionByDate, UserMode, WorkspaceId} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {formateDateToDMY} from "@/features/utilities/date/formateDates";

export const createNewSection = async (
    userId: string | undefined,
    userName: string,
    projectId: string,
    inputValue: string,
    time: string,
    date: Date | null,
    setInputValue: (value: React.SetStateAction<string>) => void,
    setIsInfoModalOpen: (value: React.SetStateAction<boolean>) => void,
    category: LoggingType,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    if (inputValue.trim().length < 1) {
        setIsInfoModalOpen(true);
        setInputValue("")
        return
    }

    if (!userId) return;
    const userRef = getFirestoreTargetRef(userId, mode, workspaceId);

    // Random Num Variable
    const randomNum = throwRandomNum(10_000_000).toString()
    const sectionId = `${inputValue.replace(/\s+/g, "")}_${randomNum}`

    // Curr Date Variable
    if (date === null) date = new Date();
    const currDate: string = formateDateToDMY(date)


    const newSection: Section = {
        projectId: projectId,
        sectionId: sectionId,
        userName: userName,
        userId: userId,
        title: inputValue,
        time: time,
        updateDate: currDate,
        category: category
    };

    const newSectionUpdate: UpdatedSectionByDate = {
        projectId: projectId,
        sectionId: sectionId,
        date: currDate,
    }

    await updateDoc(userRef, {projectsSections: arrayUnion(newSection)});
    await updateDoc(userRef, {updatedSectionsByDates: arrayUnion(newSectionUpdate)})
    setInputValue("");
};
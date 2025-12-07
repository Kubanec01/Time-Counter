import React from "react";
import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {Project, ProjectType} from "@/types";
import {arrayUnion, DocumentData, DocumentReference, updateDoc} from "firebase/firestore";


export const createNewProject = async (
    e: React.FormEvent<HTMLFormElement>,
    userRef: DocumentReference<DocumentData, DocumentData> | undefined,
    inputValue: string,
    typeOfProject: ProjectType,
) => {
    e.preventDefault();

    if (!userRef) return;

    // Random Num Variable
    const randomNum = throwRandomNum().toString();

    const newProject: Project = {
        projectId: `${inputValue.replace(/\s+/g, "")}_${randomNum}`,
        title: inputValue,
        totalTime: "00:00:00",
        type: typeOfProject,
    };

    await updateDoc(userRef, {
        projects: arrayUnion(newProject),
    });
};
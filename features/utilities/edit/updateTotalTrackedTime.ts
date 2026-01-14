import React from "react";
import {LoggingType, Project, TotalTrackedTime, UserMode, WorkspaceId} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {formatSecondsToTimeString, parseTimeStringToSeconds} from "@/features/utilities/time/timeOperations";


export const updateTotalTrackedTime = async (
    userId: string | undefined,
    projectId: string,
    date: Date | null,
    time: string,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    if (!userId) return;

    // Curr Date Variable
    if (date === null) date = new Date();
    const currDate: string = date.toISOString().slice(0, 10);

    const docRef = getFirestoreTargetRef(userId, mode, workspaceId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const projects: Project[] = data.projects
    const project = projects.find(p => p.projectId === projectId);
    if (!project) {
        console.error("Project not found");
        return null
    }
    const trackedTimes = project.totalTrackedTimes ?? []

    const existingTrackedTime = trackedTimes.find(
        t => t.date === currDate
    )

    let updatedTrackedTimes: TotalTrackedTime[]

    if (existingTrackedTime) {
        updatedTrackedTimes = trackedTimes.map(t => {
            if (t.date !== currDate) return t

            const updatedTime =
                parseTimeStringToSeconds(t.time) +
                parseTimeStringToSeconds(time)

            return {
                ...t,
                time: formatSecondsToTimeString(updatedTime),
            }
        })
    } else {
        updatedTrackedTimes = [
            ...trackedTimes,
            {date: currDate, time},
        ]
    }


    const updatedProjects = projects.map((p: Project) => {
        if (p.projectId !== projectId) return p

        return {...p, totalTrackedTimes: updatedTrackedTimes}

    })

    await updateDoc(docRef, {projects: updatedProjects})


}
import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {Project, ProjectType, WorkspaceId} from "@/types";
import {doc, setDoc} from "firebase/firestore";
import {projectTasksOptions} from "@/data/users";
import {db} from "@/app/firebase/config";

export const createNewProject = async (
        userId: string | undefined,
        inputValue: string,
        typeOfProject: ProjectType,
        workspaceId: WorkspaceId,
    ) => {
        if (!userId) return


        // Random Num Variable
        const randomNum = throwRandomNum(10_000_000).toString();

        const projectId = `${inputValue.replace(/\s+/g, "")}_${randomNum}`

        const docRef = doc(db, "realms", workspaceId, "projects", projectId);

        const newProject: Project = {
            projectId: projectId,
            title: inputValue,
            totalTime: 0,
            dailyMaxTrackTime: 86400,
            weeklyMaxTrackTime: 604_800,
            type: typeOfProject,
            totalDailyTrackedTimes: {},
            membersIndividualTimes: {},
            options: projectTasksOptions,
            trackFormat: "Decimal",
            membersList: [userId]
        };

        await setDoc(docRef, newProject)
    }
;
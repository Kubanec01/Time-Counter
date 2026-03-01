import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {Project, ProjectOption, ProjectType, UserProjectOptions, WorkspaceId} from "@/types";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {projectTasksOptions} from "@/data/users";
import {db} from "@/app/firebase/config";

export interface LoggingProject extends Project {
    options: ProjectOption[],
    inactiveOptions: ProjectOption[]
    trackFormat: "Decimal" | "Range",
    customizedUsersOptions: UserProjectOptions[]
}

export const createNewLoggingProject = async (
        inputValue: string,
        typeOfProject: ProjectType,
        workspaceId: WorkspaceId,
    ) => {
        const userRef = doc(db, "realms", workspaceId);

        // Random Num Variable
        const randomNum = throwRandomNum(10_000_000).toString();

        const newProject: LoggingProject = {
            projectId: `${inputValue.replace(/\s+/g, "")}_${randomNum}`,
            title: inputValue,
            totalTime: 0,
            dailyTrackTime: 86400,
            type: typeOfProject,
            totalTrackedTimes: [],
            membersIndividualTimes: {},
            options: projectTasksOptions,
            inactiveOptions: [],
            customizedUsersOptions: [],
            trackFormat: "Decimal",
        };

        await updateDoc(userRef, {
            projects: arrayUnion(newProject),
        });
    }
;
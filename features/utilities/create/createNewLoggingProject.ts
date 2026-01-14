import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {Project, ProjectOption, ProjectType, UserMode, WorkspaceId} from "@/types";
import {arrayUnion, updateDoc} from "firebase/firestore";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {projectTasksOptions} from "@/data/users";

interface LoggingProject extends Project {
    options: ProjectOption[]
}

export const createNewLoggingProject = async (
        userId: string | undefined,
        inputValue: string,
        typeOfProject: ProjectType,
        mode: UserMode,
        workspaceId: WorkspaceId,
    ) => {

        if (!userId) return;
        const userRef = getFirestoreTargetRef(userId, mode, workspaceId);

        // Random Num Variable
        const randomNum = throwRandomNum(10_000_000).toString();

        const newProject: LoggingProject = {
            projectId: `${inputValue.replace(/\s+/g, "")}_${randomNum}`,
            title: inputValue,
            totalTime: "00:00:00",
            type: typeOfProject,
            totalTrackedTimes: [],
            options: projectTasksOptions,
        };

        await updateDoc(userRef, {
            projects: arrayUnion(newProject),
        });
    }
;
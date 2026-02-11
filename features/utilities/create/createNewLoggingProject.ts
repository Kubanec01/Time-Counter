import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {Project, ProjectOption, ProjectType, WorkspaceId} from "@/types";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {projectTasksOptions} from "@/data/users";
import {db} from "@/app/firebase/config";

interface LoggingProject extends Project {
    options: ProjectOption[]
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
            type: typeOfProject,
            totalTrackedTimes: [],
            membersIndividualTimes: {},
            options: projectTasksOptions,
        };

        await updateDoc(userRef, {
            projects: arrayUnion(newProject),
        });
    }
;
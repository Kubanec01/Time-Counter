import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {Project, ProjectOption, ProjectType, UserMode, WorkspaceId} from "@/types";
import {arrayUnion, updateDoc} from "firebase/firestore";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";

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

        const options = [
            {value: 'research', label: 'Research'},
            {value: 'meeting', label: 'Meeting'},
            {value: 'planning', label: 'Planning'},
            {value: 'deep-work', label: 'Deep Work'},
            {value: 'study', label: 'Study'},
            {value: 'coding', label: 'Coding'},
            {value: 'testing', label: 'Testing'},
            {value: 'debug', label: 'Debug'},
            {value: 'personal', label: 'Personal'},
            {value: 'custom', label: 'Custom'}
        ];

        const newProject: LoggingProject = {
            projectId: `${inputValue.replace(/\s+/g, "")}_${randomNum}`,
            title: inputValue,
            totalTime: "00:00:00",
            type: typeOfProject,
            options: options,
        };

        await updateDoc(userRef, {
            projects: arrayUnion(newProject),
        });
    }
;
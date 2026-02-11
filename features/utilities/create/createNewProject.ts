import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {Project, ProjectType, WorkspaceId} from "@/types";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";


export const createNewProject = async (
        inputValue: string,
        typeOfProject: ProjectType,
        workspaceId: WorkspaceId,
    ) => {

        const userRef = doc(db, "realms", workspaceId);

        // Random Num Variable
        const randomNum = throwRandomNum(10_000_000).toString();

        const newProject: Project = {
            projectId: `${inputValue.replace(/\s+/g, "")}_${randomNum}`,
            title: inputValue,
            totalTime: 0,
            type: typeOfProject,
            totalTrackedTimes: [],
            membersIndividualTimes: {},
        };

        await updateDoc(userRef, {
            projects: arrayUnion(newProject),
        });
    }
;
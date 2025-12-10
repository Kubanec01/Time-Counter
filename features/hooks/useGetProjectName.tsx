import {useEffect, useState} from "react";
import {onSnapshot} from "firebase/firestore";
import {auth} from "@/app/firebase/config";
import {Project, UserMode, WorkspaceId} from "@/types";
import {useAuthState} from "react-firebase-hooks/auth";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";


export const useGetProjectName = (
    projectId: string,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    const [projectName, setProjectName] = useState("");
    const [user] = useAuthState(auth)
    const userId = user?.uid


    useEffect(() => {
        if (!userId || !projectId) return
        const userRef = getFirestoreTargetRef(userId, mode, workspaceId);

        const fetchProjectName = onSnapshot(userRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const projects = data.projects || []
            const project: Project = projects.find((p: Project) => p.projectId === projectId);
            if (project) setProjectName(project.title);
        })

        return () => fetchProjectName()

    }, [mode, projectId, userId, workspaceId]);

    return {projectName}

}
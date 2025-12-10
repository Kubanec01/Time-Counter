import {useEffect, useState} from "react";
import {onSnapshot} from "firebase/firestore";
import {auth} from "@/app/firebase/config";
import {Project} from "@/types";
import {useAuthState} from "react-firebase-hooks/auth";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";


export const useGetProjectName = (
    projectId: string,
) => {

    const [projectName, setProjectName] = useState("");
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {mode, workspaceId} = useWorkSpaceContext()


    useEffect(() => {
        if (!userId) return
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
import {useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import {auth, db} from "@/app/firebase/config";
import {Project} from "@/types";
import {useAuthState} from "react-firebase-hooks/auth";


export const useGetProjectName = (
    projectId: string,
) => {

    const [projectName, setProjectName] = useState("");
    const [user] = useAuthState(auth)
    const userId = user?.uid


    useEffect(() => {
        if (!userId || !projectId) return
        const userRef = doc(db, "realms", userId);

        const fetchProjectName = onSnapshot(userRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const projects = data.projects || []
            const project: Project = projects.find((p: Project) => p.projectId === projectId);
            if (project) setProjectName(project.title);
        })

        return () => fetchProjectName()

    }, [projectId, userId]);

    return {projectName}

}
import {useEffect, useState} from "react";
import {Project} from "@/types";
import {db} from "@/app/firebase/config";
import {doc, onSnapshot} from "firebase/firestore";
import {documentNotFound, projectNotFound} from "@/messages/errors";


export const useProjectSettings = (workspaceId: string, projectId: string) => {

    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
            if (workspaceId === 'unset') return
            const docRef = doc(db, "realms", workspaceId)

            const fetchData = onSnapshot(docRef, snapshot => {
                if (!snapshot.exists()) return console.error(documentNotFound)
                const data = snapshot.data()
                const project = data.projects.find((p: Project) => p.projectId === projectId)
                if (!project) return console.error(projectNotFound)
                setProject(project)

            })

            return () => fetchData()

        }, [projectId, workspaceId]
    )
    ;

    if (project !== null) return project

}
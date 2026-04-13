import {useEffect, useState} from "react";
import {Project} from "@/types";
import {db} from "@/app/firebase/config";
import {doc, onSnapshot} from "firebase/firestore";


export const useProjectData = (workspaceId: string, projectId: string) => {

    const [status, setStatus] = useState<'loading' | 'found' | 'not-found'>('loading')
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
            // Guard against invalid workspaces or missing project id
            if (workspaceId === 'unset' || workspaceId === 'unused' || !projectId) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setStatus('loading')
                setProject(null)
                return
            }
            const docRef = doc(db, "realms", workspaceId, "projects", projectId)

            const fetchData = onSnapshot(docRef, snapshot => {
                if (!snapshot.exists()) {
                    setStatus('not-found')
                    return;
                }

                setProject(snapshot.data() as Project);
                setStatus('found')
            })

            return () => fetchData()

        }, [projectId, workspaceId]
    )
    ;

    return {status, project};

}
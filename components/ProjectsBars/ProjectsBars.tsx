'use client'

import {Project} from "@/types";
import {collection, onSnapshot} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {useWorkSpaceContext} from "@/features/hooks/context/workspaceContext";
import {useMounted} from "@/features/hooks/useMounted";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";
import {ProjectBar} from "@/components/ProjectBar/ProjectBar";
import {db} from "@/app/config/firebase/config";


const ProjectsBars = () => {

    // States
    const [projectsData, setProjectsData] = useState<Project[]>([]);

    const {mode, workspaceId, userId} = useWorkSpaceContext()
    const mounted = useMounted()


    // Fetch Projects
    useEffect(() => {

        if (!userId) return;
        const userRef = collection(db, "realms", workspaceId, "projects")

        const fetchProjects = onSnapshot(userRef, (snap) => {
            const projects = snap.docs.map(doc => doc.data()) as Project[];
            setProjectsData(projects)
        });

        return () => fetchProjects();
    }, [mode, userId, workspaceId]);


    if (!mounted) return null;

    return (
        <>
            <div
                className={"relative w-full flex flex-1 overflow-y-hidden"}>
                <ul className={"pb-6 pt-6 w-full overflow-y-auto z-10 mask-t-from-90% mask-b-from-90%"}>
                    {projectsData.length > 0 ?
                        <>
                            {projectsData.map((p: Project) => (
                                <ProjectBar
                                    key={p.projectId}
                                    projectId={p.projectId}
                                    title={p.title}
                                    projectTotalTimeString={formatSecondsToTimeString(p.totalTime)}
                                    membersValue={Object.keys(p.membersList).length}
                                    workspaceId={workspaceId}
                                    userId={userId}
                                />
                            ))}
                        </>
                        :
                        <>
                            <h1 className="text-custom-gray-600 text-center text-lg mt-24">
                                You have no projects created 0.o
                            </h1>
                        </>
                    }
                </ul>
            </div>
        </>
    );
};

export default ProjectsBars;

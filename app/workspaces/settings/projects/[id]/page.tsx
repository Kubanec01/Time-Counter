'use client'

import {Project, ProjectOption} from "@/types";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {auth} from "@/app/firebase/config";
import {onSnapshot} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useGetProjectName} from "@/features/hooks/useGetProjectName";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {TaskTypesOptions} from "@/app/workspaces/settings/projects/[id]/components/tasks/TaskTypesOptions";
import {UsersSettings} from "@/app/workspaces/settings/projects/[id]/components/users/Users";
import {BackButton} from "@/app/workspaces/settings/components/BackButton";

const WorkspaceProjectSettingsHome = () => {

    const [activeOptions, setActiveOptions] = useState<ProjectOption[]>([]);
    const [inactiveOptions, setInactiveOptions] = useState<ProjectOption[]>([]);

    const {id} = useParams();
    if (id === undefined) {
        throw new Error("No project id found.");
    }

    const projectId = id.toString()
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {projectName} = useGetProjectName(projectId)
    const {workspaceId, mode} = useWorkSpaceContext()

    const hasActiveAndInactiveOptions = (activeOptions.length > 0 || inactiveOptions.length > 0)


    useEffect(() => {
        if (!userId) return

        const docRef = getFirestoreTargetRef(userId, mode, workspaceId);

        const fetchOptions = onSnapshot(docRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const project = data.projects.find((p: Project) => p.projectId === projectId)
            const activeOptions: ProjectOption[] = project.options || []
            const inactiveOptions = project.inactiveOptions || []
            setActiveOptions(activeOptions)
            setInactiveOptions(inactiveOptions)
        });
        return () => fetchOptions()
    }, [mode, projectId, userId, workspaceId])

    return (
        <>
            <section
                className={"w-[90%] max-w-[700px] mx-auto mt-[200px]"}>
                <div
                    className={"w-full border-b border-white/30 flex justify-between"}>
                    <h1
                        className={"text-xl text-white/80 font-semibold ml-2"}>
                        {projectName} settings
                    </h1>
                    <BackButton/>
                </div>
                <ul
                    className={"w-full px-4 py-5 pl-0 flex flex-col gap-3"}
                >
                    {hasActiveAndInactiveOptions && (
                        <>
                            <TaskTypesOptions
                                userId={userId}
                                mode={mode}
                                workSpaceId={workspaceId}
                                projectId={projectId}/>
                            <UsersSettings
                                userId={userId}
                                mode={mode}
                                workSpaceId={workspaceId}
                                projectId={projectId}/>
                        </>
                    )}
                </ul>
            </section>
        </>
    )
}

export default WorkspaceProjectSettingsHome
'use client'

import {Project, ProjectOption} from "@/types";
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {db} from "@/app/firebase/config";
import {doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useGetProjectName} from "@/features/hooks/useGetProjectName";
import {BackButton} from "@/app/workspaces/settings/components/BackButton";
import {MdArrowOutward} from "react-icons/md";
import {Switch} from "@headlessui/react";
import {LoggingProject} from "@/features/utilities/create/createNewLoggingProject";


const WorkspaceProjectSettingsHome = () => {

    const [activeOptions, setActiveOptions] = useState<ProjectOption[]>([]);
    const [inactiveOptions, setInactiveOptions] = useState<ProjectOption[]>([]);
    const [trackFormat, setTrackFormat] = useState<"Decimal" | "Range">("Decimal");

    const {id} = useParams();
    if (id === undefined) {
        throw new Error("No project id found.");
    }


    const projectId = id.toString()
    const {projectName} = useGetProjectName(projectId)
    const {workspaceId, mode} = useWorkSpaceContext()
    const router = useRouter()
    const docRef = doc(db, "realms", workspaceId);

    const hasActiveAndInactiveOptions = (activeOptions.length > 0 || inactiveOptions.length > 0)

    const updateTrackFormat = async (value: "Decimal" | "Range") => {
        setTrackFormat(value)

        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return;

        const data = docSnap.data()
        const projects = data.projects
        const updatedProjects = projects.map((p: LoggingProject) => {
            if (p.projectId !== projectId) return p

            return {...p, trackFormat: value}
        })

        await updateDoc(docRef, {projects: updatedProjects})
    }

    useEffect(() => {

        const fetchOptions = onSnapshot(docRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const project = data.projects.find((p: Project) => p.projectId === projectId)
            const activeOptions: ProjectOption[] = project.options || []
            const inactiveOptions = project.inactiveOptions || []
            const trackFormat = project.trackFormat
            setActiveOptions(activeOptions)
            setInactiveOptions(inactiveOptions)
            setTrackFormat(trackFormat)
        });
        return () => fetchOptions()
    }, [mode, projectId, workspaceId])

    console.log(trackFormat)

    return (
        <>
            <section
                className={"w-[90%] max-w-[800px] border-l-2 pl-8 border-black/10 mx-auto mt-[200px]"}>
                <div
                    className={"w-full border-black/10 border-b-2 py-6 pr-2 flex justify-between"}>
                    <h1
                        className={"text-xl text-black font-bold"}>
                        {projectName} settings
                    </h1>
                    <BackButton/>
                </div>
                <section
                    className={"w-full flex flex-col gap-3"}
                >
                    <button
                        onClick={() => router.push('/workspaces/users')}
                        className={"py-6 text-base border-black/10 border-b-2 cursor-pointer"}
                    >
                        <div
                            className={"w-full flex justify-between"}
                        >
                            <h1
                                className={"text-start font-bold mb-1.5"}>
                                Users
                            </h1>
                            <MdArrowOutward className={"text-lg text-gray-500/90"}/>
                        </div>
                        <p
                            className={"text-start text-sm w-[70%] text-gray-500/90"}>
                            Go to the users page and manage each user, assigning them permissions, options, and
                            tools.
                        </p>
                    </button>
                    <div
                        className={"py-6 text-base border-black/10 border-b-2"}
                    >
                        <div
                            className={"w-full flex justify-between"}
                        >
                            <h1
                                className={"text-start font-bold mb-1.5"}>
                                Track format
                            </h1>
                            <Switch
                                checked={trackFormat === "Range"}
                                onChange={() => {
                                    const value = trackFormat === "Decimal" ? "Range" : "Decimal"
                                    updateTrackFormat(value)
                                }}
                                className="group relative flex h-6.5 w-13 cursor-pointer rounded-full bg-black/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-vibrant-purple-600 data-focus:outline data-focus:outline-white"
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none inline-block size-4.5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-6"
                                />
                            </Switch>
                        </div>
                        <p
                            className={"text-start text-sm w-[70%] text-gray-500/90"}>
                            Set time tracking to (From - To) format. This will allow you to set the clock to the exact
                            time
                            you worked, rounded to the nearest 15 minutes. When turned off, time tracking will default
                            to 0.25 mode.
                        </p>
                    </div>
                    {hasActiveAndInactiveOptions && (
                        <>
                            {/*<TaskTypesOptions*/}
                            {/*    userId={userId}*/}
                            {/*    mode={mode}*/}
                            {/*    workSpaceId={workspaceId}*/}
                            {/*    projectId={projectId}/>*/}
                            {/*<UsersSettings*/}
                            {/*    userId={userId}*/}
                            {/*    mode={mode}*/}
                            {/*    workSpaceId={workspaceId}*/}
                            {/*    projectId={projectId}/>*/}
                        </>
                    )}
                </section>
            </section>
        </>
    )
}

export default WorkspaceProjectSettingsHome
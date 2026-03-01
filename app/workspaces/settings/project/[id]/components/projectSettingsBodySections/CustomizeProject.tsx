import {ToggleButton} from "@/app/workspaces/settings/components/buttons/ToggleButton";
import {useEffect, useState} from "react";
import {doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {LoggingProject} from "@/features/utilities/create/createNewLoggingProject";
import {useParams} from "next/navigation";
import {documentNotFound} from "@/messages/errors";
import {Project, ProjectOption} from "@/types";
import {MaxTrackingTime} from "@/app/workspaces/settings/components/buttons/MaxTrackingTime";
import {updateProjectDailyTrackLimit} from "@/features/utilities/create/updateProjectDailyTrackLimit";
import {ProjectOptions} from "@/app/workspaces/settings/components/buttons/ProjectOptions";

export const CustomizeProject = () => {


    const [optionTimeFormat, setOptionTimeFormat] = useState<"Range" | "Decimal">("Decimal");
    const [dailyTrackLimit, setDailyTrackLimit] = useState<number>(86400);
    const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);


    const {workspaceId} = useWorkSpaceContext()
    const projectId = useParams().id as string;
    const docRef = doc(db, "realms", workspaceId);

    const updateTrackFormat = async (value: "Decimal" | "Range") => {
        setOptionTimeFormat(value)

        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return console.error(documentNotFound);

        const data = docSnap.data()
        const projects = data.projects
        const updatedProjects = projects.map((p: LoggingProject) => {
            if (p.projectId !== projectId) return p

            return {...p, trackFormat: value}
        })

        await updateDoc(docRef, {projects: updatedProjects})
    }

    const updateTrackLimit = (v: number) => {
        setDailyTrackLimit(v)
        updateProjectDailyTrackLimit(workspaceId, projectId, v)
    }

    useEffect(() => {

        const fetchOptions = onSnapshot(docRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const project: LoggingProject = data.projects.find((p: Project) => p.projectId === projectId)
            const dailyTrackLimit = project.dailyTrackTime
            const activeOptions: ProjectOption[] = project.options || []
            const trackFormat = project.trackFormat
            setOptionTimeFormat(trackFormat)
            setDailyTrackLimit(dailyTrackLimit)
            setProjectOptions(activeOptions)
        });
        return () => fetchOptions()
    }, [projectId, workspaceId])

    return (
        <section
            className={"w-full flex flex-col"}>
            <div
                className={"py-5"}>
                <h1
                    className={"text-[22px] font-medium"}>
                    Customize your project
                </h1>
                <p
                    className={"font-medium text-xs text-black/50 w-[70%]"}>
                    Here you can modify your project’s features and appearance, set strict rules, or simply fine-tune
                    everything to your liking. All settings can be restored at any time.
                </p>
            </div>
            {/* Set time format */}
            <ToggleButton
                title={"Track format"}
                specSubtitle={" Set time tracking to (From - To) format. This will allow you to set the clock to the exact time you worked, rounded to the nearest 15 minutes. When turned off, time tracking will default to 0.25 mode."}
                isToggleActive={optionTimeFormat === "Range"}
                toggleFunction={() => {
                    const value = optionTimeFormat === "Decimal" ? "Range" : "Decimal"
                    updateTrackFormat(value)
                }}
            />
            {/* Set max tracking time */}
            <MaxTrackingTime
                title={"Max. tracking time"}
                value={String(dailyTrackLimit)}
                changeFunction={(v) => updateTrackLimit(v)}
            />
            <ProjectOptions
                projectId={projectId}
                workspaceId={workspaceId}
                projectOptions={projectOptions}
            />
        </section>
    )
}
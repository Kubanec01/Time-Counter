import {ToggleButton} from "@/app/workspaces/settings/components/buttons/ToggleButton";
import {useEffect, useState} from "react";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useParams} from "next/navigation";
import {documentNotFound} from "@/messages/errors";
import {Project, ProjectOption} from "@/types";
import {MaxTrackingTime} from "@/app/workspaces/settings/components/buttons/MaxTrackingTime";
import {updateProjectDailyTrackLimit} from "@/features/utilities/create/updateProjectDailyTrackLimit";
import {ProjectOptions} from "@/app/workspaces/settings/components/buttons/ProjectOptions";
import {useProjectSettings} from "@/features/hooks/useProjectSettings";

export const CustomizeProject = () => {


    const [optionTimeFormat, setOptionTimeFormat] = useState<"Range" | "Decimal">("Decimal");
    const [dailyTrackLimitValue, setDailyTrackLimitValue] = useState<number>(86400);
    const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);


    const {workspaceId} = useWorkSpaceContext()
    const projectId = useParams().id as string;
    const docRef = doc(db, "realms", workspaceId);
    const project = useProjectSettings(workspaceId, projectId);

    const updateTrackFormat = async (value: "Decimal" | "Range") => {
        setOptionTimeFormat(value)

        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return console.error(documentNotFound);

        const data = docSnap.data()
        const projects = data.projects
        const updatedProjects = projects.map((p: Project) => {
            if (p.projectId !== projectId) return p

            return {...p, trackFormat: value}
        })

        await updateDoc(docRef, {projects: updatedProjects})
    }

    const updateDailyTrackTimeLimit = () => {
        console.log("update daily track limit")

        updateProjectDailyTrackLimit(workspaceId, projectId, dailyTrackLimitValue)
    }

    useEffect(() => {
            if (!project) return

            const dailyTrackLimit = project.dailyTrackTime
            const activeOptions: ProjectOption[] = project.options || []
            const trackFormat = project.trackFormat
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOptionTimeFormat(trackFormat)
            setDailyTrackLimitValue(dailyTrackLimit)
            setProjectOptions(activeOptions)
        }, [project]
    )

    return (
        <section
            className={"w-full flex flex-col"}>
            <div
                className={"py-5"}>
                <h1
                    className={"text-[22px]"}>
                    Personalize your project
                </h1>
                <p
                    className={" text-xs text-black/50 w-[70%]"}>
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
                specSubtitle={"The daily limit setting alerts and notifies you when time entries exceed the allowed limit. The maximum limit can be set to 24 hours, while the minimum limit is 1 hour."}
                value={String(dailyTrackLimitValue / 3600)}
                setValue={setDailyTrackLimitValue}
                formSubmitFunction={updateDailyTrackTimeLimit}
            />
            <ProjectOptions
                projectId={projectId}
                workspaceId={workspaceId}
                projectOptions={projectOptions}
            />
        </section>
    )
}
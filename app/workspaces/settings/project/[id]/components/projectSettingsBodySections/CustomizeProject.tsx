import {ToggleButton} from "@/app/workspaces/settings/components/buttons/ToggleButton";
import {useEffect, useState} from "react";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useParams} from "next/navigation";
import {documentNotFound} from "@/messages/errors";
import {Project, ProjectOption} from "@/types";
import {MaxTrackingTime} from "@/app/workspaces/settings/components/buttons/MaxTrackingTime";
import {updateProjectDailyTrackLimit} from "@/features/utilities/create-&-update/updateProjectDailyTrackLimit";
import {ProjectOptions} from "@/app/workspaces/settings/components/buttons/ProjectOptions";
import {useProjectSettings} from "@/features/hooks/useProjectSettings";

export const CustomizeProject = () => {


    const [optionTimeFormat, setOptionTimeFormat] = useState<"Range" | "Decimal">("Decimal");
    const [trackLimitValue, setTrackLimitValue] = useState<number>(86400);
    const [activatedTrackLimitPeriod, setActivatedTrackLimitPeriod] = useState<"daily" | "weekly">("daily");
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

    const updateTrackTimeLimit = () => {

        updateProjectDailyTrackLimit(workspaceId, projectId, activatedTrackLimitPeriod, trackLimitValue)
    }

    useEffect(() => {
            if (!project) return

            const dailyTrackLimit = project.dailyMaxTrackTime
            const weeklyTrackLimit = project.weeklyMaxTrackTime
            const activeOptions: ProjectOption[] = project.options || []
            const trackFormat = project.trackFormat
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOptionTimeFormat(trackFormat)

            if (dailyTrackLimit === 0) {
                setActivatedTrackLimitPeriod("weekly")
                setTrackLimitValue(weeklyTrackLimit)
            } else setTrackLimitValue(dailyTrackLimit)

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
                specSubtitle={"The daily limit alerts you when time entries exceed the allowed amount. By selecting a daily or weekly limit, you can define the maximum tracked time. If the limit is exceeded, the timer will be highlighted in red."}
                value={String(trackLimitValue / 3600)}
                setValueAction={setTrackLimitValue}
                formSubmitFunctionAction={updateTrackTimeLimit}
                activatedButton={activatedTrackLimitPeriod}
                setActivatedButtonAction={setActivatedTrackLimitPeriod}
            />
            <ProjectOptions
                projectId={projectId}
                workspaceId={workspaceId}
                projectOptions={projectOptions}
            />
        </section>
    )
}
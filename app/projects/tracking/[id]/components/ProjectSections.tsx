'use client'

import React, {useEffect} from "react";
import {Section, UpdatedSectionByDate} from "@/types";
import {setNameByDate} from "@/features/utilities/date/setNameByDate";
import SectionCart from "@/app/projects/tracking/[id]/components/projectCart/components/SectionCart";
import {useProjectData} from "@/features/hooks/useProjectData";
import {workerData} from "node:worker_threads";
import {useWorkspaceData} from "@/features/hooks/useWorkspaceData";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {sortDatesAscending} from "@/features/utilities/date/sortDates";
import {getUniqueDates, getUniqueDatesFromSectionByDates} from "@/features/utilities/date/getUniqueDates";

type ProjectSectionsProps = {
    projectId: string;
};

export const ProjectSections = ({...props}: ProjectSectionsProps) => {

    // States
    const [sectionsDates, setSectionsDates] = React.useState<string[]>([])
    const [sections, setSections] = React.useState<Section[]>([])

    // Hooks
    const {workspaceId, userId, userRole} = useWorkSpaceContext()
    const projectData = useProjectData(workspaceId, props.projectId)
    const workspaceData = useWorkspaceData(workspaceId)

    useEffect(() => {
        if (!workspaceData || !projectData) return

        const updateData = () => {
            const validSectionsByDates = workspaceData.updatedSectionsByDates.filter((s: UpdatedSectionByDate) => s.projectId === props.projectId)

            const ascendedSectionsByDates = sortDatesAscending(getUniqueDatesFromSectionByDates(validSectionsByDates))
            setSections(workspaceData.projectsSections.filter((s: Section) => s.projectId === props.projectId))
            setSectionsDates(ascendedSectionsByDates)

        }

        updateData()

    }, [projectData, props.projectId, workspaceData])


    return (
        <div className="border border-black/5 p-8 mb-30 mx-auto flex flex-col gap-4 rounded-xl shadow-lg bg-white/60">
            {/*<div className="w-full border">*/}
            {/*    /!* select element will be here *!/*/}
            {/*</div>*/}

            <section>
                <h1
                    className={`${sections.length === 0 ? "block" : "hidden"} text-black/44 text-sm w-full text-center`}>
                    No data found 0.o
                </h1>
                <ul className={`${sections.length === 0 ? "hidden" : "flex"}
                w-full flex-col gap-[20px]`}>
                    {sectionsDates.length > 0 && (
                        <>
                            {sectionsDates.map((date, index) => (
                                <li
                                    className="w-full"
                                    key={index}
                                >
                                    <h1 className="text-sm text-black/50 font-medium ml-2 mb-2">
                                        {setNameByDate(date)}
                                    </h1>
                                    <div
                                        className={"rounded-xl bg-black/10 p-2 pb-0.5"}>
                                        {sections.map((i) => {
                                            if (i.updateDate === date) {
                                                return (
                                                    <SectionCart
                                                        key={i.sectionId}
                                                        userName={i.userName}
                                                        sectionId={i.sectionId}
                                                        projectId={i.projectId}
                                                        title={i.title}
                                                        userId={userId}
                                                        type={i.category}
                                                    />
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </section>
        </div>
    );
};
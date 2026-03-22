'use client'

import React, {useEffect} from "react";
import {Section, UpdatedSectionByDate} from "@/types";
import {setNameByDate} from "@/features/utilities/date/setNameByDate";
import SectionCart from "@/app/projects/tracking/[id]/components/projectCart/components/SectionCart";
import {useProjectData} from "@/features/hooks/useProjectData";
import {useWorkspaceData} from "@/features/hooks/useWorkspaceData";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {sortDatesAscending} from "@/features/utilities/date/sortDates";
import {getUniqueDatesFromSectionByDates} from "@/features/utilities/date/getUniqueDates";
import {NoResultBar} from "@/components/NoTracksFoundBar/NoResultBar";
import {EntryListPanel} from "@/components/EntryListPanel/EntryListPanel";
import ListContainer from "@/components/List-Components/ListContainer/ListContainer";

type ProjectSectionsProps = {
    projectId: string;
};

export const ProjectSections = ({...props}: ProjectSectionsProps) => {

    // States
    const [sectionsDates, setSectionsDates] = React.useState<string[]>([])
    const [sections, setSections] = React.useState<Section[]>([])

    // Hooks
    const {workspaceId, userId} = useWorkSpaceContext()
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
        <EntryListPanel
            classname={"py-6"}
        >
            <>
                <NoResultBar
                    bodyClass={sections.length === 0 ? "flex" : "hidden"}
                    label={"No tracks found 0.o"}
                />
                <ul className={`${sections.length === 0 ? "hidden" : "flex"} w-full flex-col gap-[20px]`}
                >
                    {sectionsDates.map((date) => (
                        <li
                            key={date}
                            className="w-full"
                        >
                            <h1 className="text-sm text-black/50 font-medium ml-2 mb-2">
                                {setNameByDate(date)}
                            </h1>
                            <ListContainer
                                headerTitles={['Name', 'Type', 'Time', '']}
                            >
                                <>
                                    <ul
                                        className={'flex flex-col gap-1'}>
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
                                    </ul>
                                </>
                            </ListContainer>
                        </li>
                    ))}
                </ul>
            </>
        </EntryListPanel>
    );
};

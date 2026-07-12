'use client'

import React, {useEffect} from "react";
import {Section, UpdatedSectionByDate} from "@/types";
import {setNameByDate} from "@/features/utilities/date/setNameByDate";
import SectionCart from "@/app/projects/tracking/[id]/components/projectCart/components/SectionCart";
import {useProjectData} from "@/features/hooks/useProjectData";
import {useWorkspaceData} from "@/features/hooks/useWorkspaceData";
import {useWorkSpaceContext} from "@/features/hooks/context/workspaceContext";
import {sortDatesAscending} from "@/features/utilities/date/sortDates";
import {getUniqueDatesFromSectionByDates} from "@/features/utilities/date/getUniqueDates";
import {NoResultBar} from "@/components/NoTracksFoundBar/NoResultBar";
import {EntryListPanel} from "@/components/EntryListPanel/EntryListPanel";
import ListContainer from "@/components/List-Components/ListContainer/ListContainer";
import MaxTrackingTimeIndicator from "@/components/MaxTrackingTimeIndicator/MaxTrackingTimeIndicator";

type ProjectSectionsProps = {
    projectId: string;
    selectedUserId: string;
};

export const ProjectSections = ({...props}: ProjectSectionsProps) => {

    // States
    const [sectionsDates, setSectionsDates] = React.useState<string[]>([])
    const [sections, setSections] = React.useState<Section[]>([])
    const {workspaceId, userId, userRole} = useWorkSpaceContext()
    const {project} = useProjectData(workspaceId, props.projectId)
    const workspaceData = useWorkspaceData(workspaceId)

    useEffect(() => {
        if (!workspaceData || !project) return


        const updateData = () => {
        const updatedSectionsByDates = workspaceData.updatedSectionsByDates

            if(updatedSectionsByDates === undefined) return

            const validSectionsByDates = updatedSectionsByDates
                .filter((s: UpdatedSectionByDate) => s.projectId === props.projectId)

            const ascendedSectionsByDates = sortDatesAscending(getUniqueDatesFromSectionByDates(validSectionsByDates))
            const projectSections: Section[] = workspaceData.projectsSections.filter((s: Section) => s.projectId === props.projectId)

            const filteredSectionsByUSerRole = () => {
                if (userRole === 'Member') return projectSections.filter((sec) => sec.userId === userId)
                else return projectSections
            }

            setSections(filteredSectionsByUSerRole())
            setSectionsDates(ascendedSectionsByDates)

        }

        updateData()

    }, [project, props.projectId, workspaceData])

    // Tato funkcia je zatial zakomentovana, v pripade sirsieho vyuzitia trackovanaia viac userov v
    // tema ebude opatovne spristupnena

    // const maxTrackingTimeIndicatorUserValue = () => {
    //     if (userRole === 'Member') return userId
    //     else if (filteredMemberId === 'all') return userId
    //     else return filteredMemberId
    // }

    return (
        <EntryListPanel
            classname={"mb-10"}>
            <>
                <NoResultBar
                    bodyClass={sections.length === 0 ? "flex" : "hidden"}
                    label={"No tracks found 0.o"}
                />
                <ul className={`${sections.length === 0 ? "hidden" : "flex"} w-full flex-col gap-8`}>
                    {sectionsDates.map((date) => (
                        <li
                            key={date}
                            className="w-full">
                            <div
                            className={"flex items-center justify-between"}>
                                <h1 className="text-sm text-black/50 font-medium ml-2 mb-2">
                                    {setNameByDate(date)}
                                </h1>
                                <MaxTrackingTimeIndicator
                                    userId={userId}
                                    workspaceId={workspaceId}
                                    projectId={props.projectId}
                                    formatedDateToYMD={date}
                                    bodyClassname={"mr-1"}
                                />
                            </div>
                            <ListContainer
                                headerTitles={['Name', 'Type', 'Time', '']}>
                                <>
                                    <ul
                                        className={'flex flex-col gap-1'}>
                                        {sections.map((i) => {
                                            if (i.updateDate === date) {
                                                return (
                                                    <SectionCart
                                                        updatedDate={i.updateDate}
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

'use client'

import {addDays, isSameDay, subDays} from "date-fns";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import {MaxDateCalendarInput} from "@/features/utilities/date/MaxDateCalendarInput";
import {SectionCart} from "@/app/projects/logging/[id]/components/components/SectionCart";
import React, {useEffect, useState} from "react";
import {BaseOption, Member, Section} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {formateDateToYMD} from "@/features/utilities/date/dateOperations";
import {getAllWorkspaceMembers} from "@/features/utilities/getAllWorkspaceMembers";
import {useProjectData} from "@/features/hooks/useProjectData";
import {useWorkspaceData} from "@/features/hooks/useWorkspaceData";
import {EntryListPanel} from "@/components/EntryListPanel/EntryListPanel";
import {SelectBar} from "@/components/SelectBar/SelectBar";
import {LargeButton} from "@/components/LargeButton/LargeButton";
import {NoResultBar} from "@/components/NoTracksFoundBar/NoResultBar";
import ListContainer from "@/components/List-Components/ListContainer/ListContainer";
import MaxTrackingTimeIndicator from "@/components/MaxTrackingTimeIndicator/MaxTrackingTimeIndicator";
import {useRouter} from "next/navigation";
import {LoadingPage} from "@/app/LoadingPage/LoadingPage";


export const ProjectSectionsSection = ({projectId}: { projectId: string }) => {

    // Date
    const currDate = new Date();

    // States
    const [members, setMembers] = useState<Member[]>([])
    const [filteredMemberId, setFilteredMemberId] = useState<string | "all">("all")
    const [filteredDate, setFilteredDate] = useState<Date | null>(currDate);
    const [sections, setSections] = useState<Section[]>([]);
    const [filteredSections, setFilteredSections] = useState<Section[]>([]);

    const {userRole, workspaceId, userId} = useWorkSpaceContext()
    const {project} = useProjectData(workspaceId, projectId)
    const workspaceData = useWorkspaceData(workspaceId)

    useEffect(() => {

        if (!workspaceData || !project) return

        const updateData = async () => {
            const projectsSections: Section[] = workspaceData.projectsSections || []
            let validSections: Section[]

            if (userRole === 'Member') validSections = projectsSections.filter(s => s.projectId === projectId && s.userId === userId)
            else validSections = projectsSections.filter(s => s.projectId === projectId)

            const workspaceMembers = await getAllWorkspaceMembers(workspaceId)

            setSections(validSections)
            setFilteredSections(validSections.filter(s => s.updateDate === formateDateToYMD(filteredDate)))
            setMembers(workspaceMembers.filter(m => project.membersList.find(id => id === m.userId)))
        }

        updateData()

    }, [filteredDate, project, projectId, userId, userRole, workspaceData, workspaceId])

    // Variables
    const membersOptions: BaseOption[] = [
        {value: "all", label: "All Users"},
        ...members.map(m => ({value: m.userId, label: `${m.name} ${m.surname}`})),
    ]

    // Functions
    const isPlusButtonDisabled = () => {
        if (filteredDate === null) return true

        return isSameDay(filteredDate, currDate)
    }

    const filterProjectSections = (formatedDateToYMD: string) => {

        if (filteredMemberId === 'all') setFilteredSections(sections.filter(section => section.updateDate === formatedDateToYMD))
        else setFilteredSections(sections.filter(section => section.updateDate === formatedDateToYMD && section.userId === filteredMemberId))
    }

    const filterSectionsByMemberId = (id: string) => {
        setFilteredMemberId(id)
        if (id === 'all') setFilteredSections(sections.filter(section => section.updateDate === formateDateToYMD(filteredDate)))
        else setFilteredSections(sections.filter(sec => sec.userId === id && sec.updateDate === formateDateToYMD(filteredDate)))
    }

    const maxTrackingTimeIndicatorUserValue = () => {
        if (userRole === 'Member') return userId
        else if (filteredMemberId === 'all') return userId
        else return filteredMemberId
    }

    return (
        <>
            <EntryListPanel
                classname={"mb-24"}
            >
                <div
                    className={"flex flex-col w-full gap-3"}>
                    <section
                        className={"flex justify-between gap-2 w-full"}>
                        <div
                            className={"flex gap-2"}
                        >
                            {members.length > 0 &&
                                <SelectBar
                                    options={membersOptions}
                                    value={filteredMemberId}
                                    inputId={"members-input"}
                                    inputClassname={`border border-black/20 outline-none px-2 h-8.5 w-[100px] text-sm rounded-md bg-white`}
                                    onChange={(e) => filterSectionsByMemberId(e)}
                                />
                            }
                            <LargeButton
                                type={"button"}
                                className={"px-2 py-0.5 border text-base rounded-md text-white bg-black/24 hover:bg-black/40"}
                                onClick={() => {
                                    setFilteredDate(subDays(filteredDate ?? currDate, 1))
                                    filterProjectSections(formateDateToYMD(subDays(filteredDate ?? currDate, 1)))
                                }}
                            >
                                <FaAngleLeft/>
                            </LargeButton>
                            <MaxDateCalendarInput
                                inputId={"list-date-input"}
                                selectedDate={filteredDate}
                                onChange={(e) => {
                                    setFilteredDate(e)
                                    filterProjectSections(formateDateToYMD(e))
                                }}
                            />
                            <LargeButton
                                type={"button"}
                                className={`${isPlusButtonDisabled() ? "cursor-not-allowed" : "cursor-pointer hover:bg-black/40"}
                            px-2 py-0.5 border text-base rounded-md text-white bg-black/24 hover:bg-black/40`}
                                disabled={isPlusButtonDisabled()}
                                onClick={() => {
                                    setFilteredDate(addDays(filteredDate ?? new Date(), 1))
                                    filterProjectSections(formateDateToYMD(addDays(filteredDate ?? new Date(), 1)))
                                }}
                            >
                                <FaAngleRight/>
                            </LargeButton>
                        </div>
                        <div>
                            <MaxTrackingTimeIndicator
                                userId={maxTrackingTimeIndicatorUserValue()}
                                workspaceId={workspaceId}
                                projectId={projectId}
                                formatedDateToYMD={formateDateToYMD(filteredDate)}
                                bodyClassname={"mr-1"}
                            />
                        </div>
                    </section>
                    <ListContainer
                        headerTitles={['Name', 'Type', 'Time', 'Date']}
                    >
                        <ul
                            className={"flex flex-col gap-1"}>
                            {filteredSections.length > 0 ?
                                <>
                                    {filteredSections.map(s => (
                                        <SectionCart
                                            key={s.sectionId}
                                            userId={s.userId}
                                            projectId={projectId}
                                            sectionId={s.sectionId}
                                            title={s.title}
                                            time={s.time}
                                            userName={s.userName}
                                            category={s.category}
                                            updateDate={s.updateDate}
                                        />
                                    ))}
                                </>
                                :
                                <>
                                    <NoResultBar
                                        bodyClass={"bg-white rounded-xs p-4"}
                                        label={"No tracks found 0.o"}
                                    />
                                </>
                            }
                        </ul>
                    </ListContainer>
                </div>
            </EntryListPanel>
        </>
    )
}
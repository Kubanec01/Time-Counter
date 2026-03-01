"use client";

import {onSnapshot} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import SectionCart from "./components/SectionCart";
import {Member, ProjectProps, Section, UpdatedSectionByDate} from "@/types";
import {createNewSection} from "@/features/utilities/create/createNewSection";
import {setNameByDate} from "@/features/utilities/date/setNameByDate";
import {setColorByDate} from "@/features/utilities/date/setcolorByDate";
import {getUniqueDates} from "@/features/utilities/date/getUniqueDates";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {sortDatesAscending} from "@/features/utilities/date/sortDates";
import {ProjectHero} from "@/components/ProjectHero";
import {useGetProjectName} from "@/features/hooks/useGetProjectName";

const TrackingProjectCart = ({...props}: ProjectProps) => {

    // States
    const [sections, setSections] = useState<Section[]>([]);
    const [updatedSectionsByDates, setUpdatedSectionsByDates] = useState<string[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | "all">("all");
    const [inputValue, setInputValue] = useState<string>("");
    const [members, setMembers] = useState<Member[]>([]);

    // Variables
    const projectId = props.projectId;

    const {mode, workspaceId, userName, userSurname, userRole, userId} = useWorkSpaceContext()
    const {projectName} = useGetProjectName(projectId)


    // Fetch Sections Data
    useEffect(() => {
        if (!userId || !projectId) return;
        const userRef = getFirestoreTargetRef(userId, mode, workspaceId);

        const getSectionsData = onSnapshot(userRef, (snap) => {
            if (!snap.exists()) return


            const data = snap.data();
            const sections = data.projectsSections || [];
            const updatedSectionsByDates: UpdatedSectionByDate[] = data.updatedSectionsByDates || []


            if (mode === "workspace" && userRole !== "Member") {
                const membersData: Member[] = data.members
                setMembers(membersData)
            }

            let validSections: Section[] = []

            if (userRole === "Member") {
                validSections = sections.filter(
                    (s: Section) => s.projectId === projectId && s.userId === userId
                );
            } else if (selectedUserId === "all") {
                validSections = sections.filter(
                    (s: Section) => s.projectId === projectId
                );
            } else {
                validSections = sections.filter(
                    (s: Section) => s.projectId === projectId && s.userId === selectedUserId
                );
            }

            const validUpdatedSectionByDates: UpdatedSectionByDate[] = updatedSectionsByDates.filter((u: UpdatedSectionByDate) => validSections.some(s => s.sectionId === u.sectionId));

            const filteredDates = getUniqueDates(validUpdatedSectionByDates)

            setSections(validSections);
            setUpdatedSectionsByDates(sortDatesAscending(filteredDates))
        });

        return () => getSectionsData();
    }, [userId, projectId, mode, workspaceId, userRole, selectedUserId]);


    // Functions
    const createSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const userFullName = `${userName} ${userSurname}`
        const time = 0;
        await createNewSection(userId, userFullName, props.projectId, inputValue, time, new Date(), setInputValue, "unset", workspaceId)
    }

    return (
        <>
            <section
                className={"w-[90%] max-w-[876px] mx-auto pt-8 border-b-2 border-custom-gray-600/50 pb-3 px-2"}
            >
                <ProjectHero projectSpec={"Tracking"} projectName={projectName}/>
                <div
                    className={"mx-auto flex justify-center gap-4 mt-20"}>
                    <select
                        onChange={(event) => {
                            const value = event.target.value as string | "all";
                            setSelectedUserId(value);
                        }}
                        className={` ${members.length < 2 || userRole === "Member" ? "hidden" : "block"}
                        border border-black/20 outline-none px-2 py-1.5 w-[120px] text-sm rounded-lg bg-white cursor-pointer`}>
                        <option value="all">All Users</option>
                        {members.map((mem) => (
                            <option key={mem.userId} value={mem.userId}>
                                {mem.name} {mem.surname}
                            </option>
                        ))}
                    </select>
                    <form
                        onSubmit={createSection}
                        className={"flex justify-between gap-4"}
                    >
                        <input
                            placeholder={"What do you want to work on?"}
                            className={"w-[340px] rounded-lg pl-3 text-sm bg-white border border-black/20 outline-none"}
                            type="text"
                            value={inputValue}
                            maxLength={24}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button
                            disabled={inputValue.trim().length === 0}
                            type={"submit"}
                            className={"medium-button bg-purple-gradient"}>
                            Create Timer
                        </button>
                    </form>
                </div>
            </section>
            <section
                className={"w-[90%] max-w-[756px] mx-auto mt-[30] mb-[20]"}>
                <ul className="w-full flex flex-col gap-[20px]">
                    {updatedSectionsByDates.length > 0
                        ?
                        <>
                            {updatedSectionsByDates.map((section, index) => (
                                <ul
                                    className={`w-full px-[12px] pt-[12px] pb-[4px] rounded-[12px] shadow-lg ${setColorByDate(section)}`}
                                    key={index}>
                                    <h1
                                        className={"text-sm text-black/50 font-semibold  ml-[24px] mb-[12px]"}
                                    >
                                        {setNameByDate(section)}
                                    </h1>
                                    {sections.map((i) => {
                                        if (i.updateDate === section) {
                                            return (
                                                <SectionCart
                                                    key={i.sectionId}
                                                    userName={i.userName}
                                                    sectionId={i.sectionId}
                                                    projectId={i.projectId}
                                                    title={i.title}
                                                    userId={userId}
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                                </ul>
                            ))}
                        </>

                        :
                        <h1
                            className={"w-full h-full flex justify-center items-center text-xl text-gray-500"}>
                            You have no sections created 0.o
                        </h1>
                    }
                </ul>
            </section>
        </>
    );
};

export default TrackingProjectCart;

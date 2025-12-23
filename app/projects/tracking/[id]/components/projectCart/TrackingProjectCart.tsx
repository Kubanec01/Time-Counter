"use client";

import {auth} from "@/app/firebase/config";
import {onSnapshot} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import SectionCart from "./components/SectionCart";
import {ProjectProps, Section, UpdatedSectionByDate} from "@/types";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";
import InformativeModal from "@/components/modals/InformativeModal";
import {sortDatesAscending} from "@/features/utilities/date/sortDates";
import {useAuthState} from "react-firebase-hooks/auth";
import {createNewSection} from "@/features/utilities/create/createNewSection";
import {setNameByDate} from "@/features/utilities/date/setNameByDate";
import {setColorByDate} from "@/features/utilities/date/setcolorByDate";
import {getUniqueDates} from "@/features/utilities/date/getUniqueDates";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {useMounted} from "@/features/hooks/useMounted";

const TrackingProjectCart = ({...props}: ProjectProps) => {

    // States
    const [sections, setSections] = useState<Section[]>([]);
    const [updatedSectionsByDates, setUpdatedSectionsByDates] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const [user] = useAuthState(auth)
    const {mode, workspaceId, userName, userSurname} = useWorkSpaceContext()

    // Variables
    const projectId = props.projectId;
    const userId = user?.uid

    const mounted = useMounted()


    // Fetch Sections Data
    useEffect(() => {
        if (!userId || !projectId) return;
        const userRef = getFirestoreTargetRef(userId, mode, workspaceId);

        const getSectionsData = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                const sections = data.projectsSections || [];
                const updatedSectionsByDates = data.updatedSectionsByDates || []

                const validUpdatedSectionByDates: UpdatedSectionByDate[] = updatedSectionsByDates.filter((s: UpdatedSectionByDate) => s.projectId === projectId);

                const validSections = sections.filter(
                    (s: Section) => s.projectId === projectId
                );

                const filteredDates = getUniqueDates(validUpdatedSectionByDates)

                setSections(validSections);
                setUpdatedSectionsByDates(sortDatesAscending(filteredDates))

            } else {
                setSections([])
                setUpdatedSectionsByDates([])
            }

        });

        return () => getSectionsData();
    }, [userId, projectId]);


    // Functions
    const createSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const userFullName = `${userName} ${userSurname}`
        const time = "00:00:00";
        await createNewSection(
            userId,
            userFullName,
            props.projectId,
            inputValue,
            time,
            setInputValue,
            setIsInfoModalOpen,
            "unset",
            mode,
            workspaceId)
    }


    return (
        <>
            <ProjectCartNavbar projectName={props.projectName}/>
            <section
                className={"w-[90%] max-w-[776px] mx-auto pt-[198px] border-b-2 border-custom-gray-600 pb-3 px-20"}
            >
                <form
                    onSubmit={createSection}
                    className={"flex justify-between"}
                >
                    <input
                        placeholder={"What do you want to work on?"}
                        className={"w-[476px] h-[38px] rounded-[4px] pl-2 text-sm border border-custom-gray-800 outline-none"}
                        type="text"
                        value={inputValue}
                        maxLength={24}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                        type={"submit"}
                        className={"w-[119px] h-[38px] text-base rounded-[4px] text-white bg-pastel-purple-800 cursor-pointer"}>
                        New Timer
                    </button>
                </form>
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
                                        className={"text-sm text-custom-gray-800  ml-[24px] mb-[12px]"}
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
            <InformativeModal setIsModalOpen={setIsInfoModalOpen} isModalOpen={isInfoModalOpen}
                              title={"You can't have a section without a name."}/>
        </>
    );
};

export default TrackingProjectCart;

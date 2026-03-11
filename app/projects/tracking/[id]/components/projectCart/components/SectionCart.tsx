"use client";

import DeleteModal from "@/components/modals/DeleteModal";
import {doc, getDoc, onSnapshot,} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {useStopwatch} from "react-timer-hook";
import {Section, SectionCartProps, TimeCheckout} from "@/types";
import {useClockTimeContext} from "@/features/contexts/clockCountContext";
import InformativeModal from "@/components/modals/InformativeModal";
import {FiDelete, FiEdit, FiPause, FiPlay} from "react-icons/fi";
import RenameModal from "@/components/modals/RenameModal";
import {resetClockTime} from "@/features/utilities/time/resetClockTime";
import {deleteAllSectionData} from "@/features/utilities/delete/deleteAllSectionData";
import {createNewTimeCheckout} from "@/features/utilities/create/createNewTimeCheckout";
import {updateTimeData} from "@/features/utilities/time/updateTimeData";
import {editSectionName} from "@/features/utilities/edit/editSectionName";
import {deleteSubsectionAndTimeCheckoutsData} from "@/features/utilities/delete/deleteSubsectionAndTimeCheckoutsData";
import SubSectionCart from "@/app/projects/tracking/[id]/components/projectCart/components/SubSectionCart";
import {
    formatTimeUnit, updateProjectTotalTime
} from "@/features/utilities/time/timeOperations";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {HiMiniUserCircle} from "react-icons/hi2";
import {formateDateToYMD, formateYMDToDMY} from "@/features/utilities/date/dateOperations";
import {db} from "@/app/firebase/config";
import {useSectionSettings} from "@/features/hooks/useSectionSettings";
import {updateUserIndividualTime} from "@/features/utilities/create/updateUserIndividualTime";


const SectionCart = ({...props}: SectionCartProps) => {

    const currDate = new Date()

    // States
    const [isRunning, setIsRunning] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [subSections, setSubSections] = useState<TimeCheckout[] | []>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [lastStopClockTime, setLastStopClockTime] = useState(0)

    // Context
    const {
        setIsClocktimeRunning,
        isClocktimeRunning,
        setActiveClockTimeSectionId,
        activeClockTimeSectionId
    } = useClockTimeContext()
    const {mode, workspaceId, userRole} = useWorkSpaceContext()

    const section = useSectionSettings(props.sectionId, workspaceId)
    const isWorkspaceRoleAdmin = mode === "workspace" && (userRole === "Admin" || userRole === "Manager");

    // Clock Time
    const {seconds, minutes, hours, start, pause, reset, totalSeconds} = useStopwatch({autoStart: false});
    const newTime = `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
    const formatedDate = formateDateToYMD(currDate);


    // Functions
    const deleteSubSection = async (subSectionId: string, durationTime: number, sectionId: string) => {

        const updatedClockTime = totalSeconds - durationTime
        resetClockTime(updatedClockTime, reset)
        setLastStopClockTime(updatedClockTime)

        await updateProjectTotalTime(props.projectId, durationTime, workspaceId, "decrease")
        await updateUserIndividualTime(props.userId, workspaceId, props.projectId, formatedDate, durationTime, 1000, "decrease")
        await deleteSubsectionAndTimeCheckoutsData(subSectionId, sectionId, updatedClockTime, workspaceId)
    }

    const toggleTimer = async () => {
        if (isClocktimeRunning && (activeClockTimeSectionId !== props.sectionId)) return setIsInfoModalOpen(true);


        const formatedTime = `${currDate.getHours().toString().padStart(2, "0")}:${currDate.getMinutes().toString().padStart(2, "0")}`;

        if (!isRunning) {
            start();
            setIsClocktimeRunning(true)
            setActiveClockTimeSectionId(props.sectionId)
            setIsRunning(true);
            setStartTime(formatedTime);
        } else {
            pause();
            setIsClocktimeRunning(false)
            setActiveClockTimeSectionId("")
            setIsRunning(false);
            setLastStopClockTime(totalSeconds)
            const difference = totalSeconds - lastStopClockTime
            await updateProjectTotalTime(props.projectId, difference, workspaceId, "increase")
            await updateTimeData(props.sectionId, totalSeconds, formatedDate, workspaceId);
            await createNewTimeCheckout(props.projectId, props.sectionId, formatedDate, startTime, formatedTime, difference, workspaceId);
            await updateUserIndividualTime(props.userId, workspaceId, props.projectId, formatedDate, difference, 1000, "increase")
        }
    };


    // Fetch Initial ClockTime
    useEffect(() => {

        const fetchData = async () => {
            const docRef = doc(db, 'realms', workspaceId)
            const snap = await getDoc(docRef)
            if (!snap.exists()) return
            const data = snap.data()
            const section = data.projectsSections.find((s: Section) => s.sectionId === props.sectionId)
            setLastStopClockTime(section.time)
            resetClockTime(section.time, reset)
        }

        fetchData()

    }, [props.sectionId, reset, workspaceId]);

    // Fetch Time Checkouts
    useEffect(() => {

        const userRef = doc(db, "realms", workspaceId);

        const fetchTimeCheckouts = onSnapshot(userRef, (snap) => {
            if (!snap.exists()) return;

            const data = snap.data();
            const timeCheckoutsData = data.timeCheckouts || []
            const timeCheckouts = timeCheckoutsData.filter(
                (ch: TimeCheckout) => ch.sectionId === props.sectionId
            );
            setSubSections(timeCheckouts);
        });
        return () => fetchTimeCheckouts();
    }, [props.userId, props.sectionId, mode, workspaceId]);

    return (
        <div
            key={props.sectionId}
            className={`w-full rounded-lg flex flex-col flex-between relative bg-white p-2 mb-[8px]`}>
            {/*User Name*/}
            <div
                className={`${isWorkspaceRoleAdmin ? "flex" : "hidden"}`}>
            <span
                className={`flex gap-0.5 px-1.5 py-0.5 mb-1 rounded-full font-medium bg-black/10 text-xs text-custom-gray-800`}>
                    <HiMiniUserCircle className={"text-sm"}/>
                {props.userName}
            </span>
            </div>
            <div
                className={"px-2"}>
                <div
                    className={"w-full border-b border-black/16 flex items-center pb-0.5"}>
                    <p
                        className={"text-vibrant-purple-700 text-sm font-medium w-1/4"}>
                        Name
                    </p>
                    <p
                        className={"text-vibrant-purple-700 text-sm font-medium w-1/4"}>
                        Type
                    </p>
                    <p
                        className={"text-vibrant-purple-700 text-sm font-medium w-1/4"}>
                        Time
                    </p>
                </div>
                <div
                    className={"flex items-center pt-1.5"}>
                    <p
                        className={"text-black text-sm w-1/4"}>
                        {props.title}
                    </p>
                    <p
                        className={"text-black text-sm w-1/4"}>
                        {props.type}
                    </p>
                    <p
                        className={"text-black text-sm w-1/4 font-medium"}>
                        {newTime}
                    </p>
                    {/*Buttons*/}
                    <div
                        className={"flex items-center justify-end pr-8 gap-0.5 flex-1"}>
                        <button
                            onClick={() => toggleTimer()}
                            className={`cursor-pointer p-1.5 border bg-purple-gradient border-vibrant-purple-700 rounded-l-md flex items-center justify-center pl-2`}>
                            {isRunning ? <FiPause/> : <FiPlay/>}
                        </button>
                        <button
                            disabled={isRunning}
                            onClick={() => setIsEditModalOpen(true)}
                            className={`cursor-pointer p-1.5 border border-black/22 bg-linear-to-b from-white from-50% to-black/10 text-black/40 hover:from-black/2 flex items-center justify-center pl-2`}>
                            <FiEdit/>
                        </button>
                        <button
                            disabled={isRunning}
                            onClick={() => setIsDeleteModalOpen(true)}
                            className={`cursor-pointer p-1.5 pr-2 border border-black/22 bg-linear-to-b from-white from-50% to-black/10 text-black/40  hover:from-black/2 rounded-r-md flex items-center justify-center`}>
                            <FiDelete/>
                        </button>
                    </div>
                </div>
            </div>
            <ul
                className={`${
                    subSections.length > 0 ? "flex-1" : "hidden"
                } w-full flex flex-col justify-center items-center mt-2 border-t border-black/12`}
            >
                {subSections.map((s, index) => (
                    <SubSectionCart
                        key={s.subSectionId}
                        index={index}
                        startTime={s.startTime}
                        stopTime={s.stopTime}
                        durationTime={s.durationTime}
                        date={formateYMDToDMY(s.date)}
                        deleteFunction={() => deleteSubSection(s.subSectionId, s.durationTime, s.sectionId)}
                    />
                ))}
            </ul>
            {/*Modals*/
            }
            <DeleteModal
                isModalOpen={isDeleteModalOpen}
                setIsModalOpen={setIsDeleteModalOpen}
                title={"Delete track?"}
                desc={"Are you sure you want to delete this track? This step is irreversible and everything stored in this track will be deleted."}
                deleteBtnText={"Delete Track"}
                btnFunction={() => deleteAllSectionData(props.userId, props.projectId, props.sectionId, workspaceId, formateDateToYMD(new Date()), seconds)}
                topDistance={300}
            />
            <RenameModal
                setIsModalOpen={() => setIsEditModalOpen(false)}
                isModalOpen={isEditModalOpen}
                setInputValue={setInputValue}
                inputValue={inputValue}
                title={"Rename track?"}
                inputPlaceholder={"What is new edit-name?"}
                desc={"You can rename your track anytime, anywhere. Name must contain a maximum of 24 characters."}
                formFunction={(e) => {
                    e.preventDefault()
                    editSectionName(props.projectId, props.sectionId, inputValue, setInputValue, setIsEditModalOpen, workspaceId)
                }
                }
            />
            <InformativeModal
                isModalOpen={isInfoModalOpen}
                setIsModalOpen={setIsInfoModalOpen}
                title={"You cannot run 2 tracks at the same time."}
            />
        </div>
    )
        ;
};

export default SectionCart;
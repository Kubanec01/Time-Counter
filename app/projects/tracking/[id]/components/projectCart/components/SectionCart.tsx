"use client";

import DeleteModal from "@/components/modals/DeleteModal";
import {getDoc, onSnapshot,} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {useStopwatch} from "react-timer-hook";
import {Section, SectionCartProps, TimeCheckout} from "@/types";
import {useClockTimeContext} from "@/features/contexts/clockCountContext";
import InformativeModal from "@/components/modals/InformativeModal";
import {FiDelete, FiEdit, FiPause, FiPlay} from "react-icons/fi";
import RenameModal from "@/components/modals/RenameModal";
import {RiEditBoxFill} from "react-icons/ri";
import {resetClockTime} from "@/features/utilities/time/resetClockTime";
import {deleteAllSectionData} from "@/features/utilities/delete/deleteAllSectionData";
import {createNewTimeCheckout} from "@/features/utilities/create/createNewTimeCheckout";
import {sendTimeData} from "@/features/utilities/time/updateTimeData";
import {editSectionName} from "@/features/utilities/edit/editSectionName";
import {stopTimeDifference} from "@/features/utilities/time/stopTimeDifference";
import {deleteSubsectionAndTimeCheckoutsData} from "@/features/utilities/delete/deleteSubsectionAndTimeCheckoutsData";
import SubSectionCart from "@/app/projects/tracking/[id]/components/projectCart/components/SubSectionCart";
import {formatSecondsToTimeString, formatTimeUnit, parseTimeStringToSeconds} from "@/features/hooks/timeOperations";
import {setProjectTotalTime, subtractProjectTotalTime} from "@/features/utilities/time/totalTime";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {HiMiniUserCircle} from "react-icons/hi2";


const SectionCart = ({...props}: SectionCartProps) => {

    // States
    const [isRunning, setIsRunning] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [subSections, setSubSections] = useState<TimeCheckout[] | []>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const isAnySections = subSections.length > 0;
    const [lastStopClockTime, setLastStopClockTime] = useState(0)

    // Context
    const {
        setIsClocktimeRunning,
        isClocktimeRunning,
        setActiveClockTimeSectionId,
        activeClockTimeSectionId
    } = useClockTimeContext()
    const {mode, workspaceId, userRole} = useWorkSpaceContext()

    // Hooks
    const {seconds, minutes, hours, start, pause, reset, totalSeconds} = useStopwatch({autoStart: false});

    // Clock Time
    const newTime = `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;


    // Functions
    const deleteSubSection = async (subSectionId: string, difference: string, sectionId: string) => {

        const updatedClockTime = totalSeconds - parseTimeStringToSeconds(difference)
        const formatedUpdatedClockTime = formatSecondsToTimeString(updatedClockTime)
        resetClockTime(updatedClockTime, reset)
        setLastStopClockTime(updatedClockTime)

        await deleteSubsectionAndTimeCheckoutsData(props.userId, subSectionId, sectionId, formatedUpdatedClockTime, setSubSections, mode, workspaceId)
        await subtractProjectTotalTime(props.userId, props.projectId, difference, mode, workspaceId)
    }
    const toggleTimer = async () => {
        if (isClocktimeRunning && (activeClockTimeSectionId !== props.sectionId)) return setIsInfoModalOpen(true);

        const now = new Date();
        const formattedTime = `${formatTimeUnit(now.getHours())}:${formatTimeUnit(now.getMinutes())}`;
        const currDateString = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

        if (!isRunning) {
            setIsClocktimeRunning(true)
            setActiveClockTimeSectionId(props.sectionId)
            setIsRunning(true);
            setStartTime(formattedTime);
            start();
        } else {
            setIsClocktimeRunning(false)
            setActiveClockTimeSectionId("")
            setIsRunning(false);
            pause();
            setLastStopClockTime(totalSeconds)
            await setProjectTotalTime(props.userId, props.sectionId, props.projectId, newTime, mode, workspaceId)
            await sendTimeData(props.userId, props.sectionId, newTime, currDateString, mode, workspaceId);
            await createNewTimeCheckout(props.userId, formattedTime, props.projectId, props.sectionId, startTime, stopTimeDifference(totalSeconds, lastStopClockTime), mode, workspaceId);
        }
    };
    const isWorkspaceRoleAdmin = mode === "workspace" && (userRole === "Admin" || userRole === "Manager");


    // Fetch Initial ClockTime
    useEffect(() => {
        const fetchInitialClockTime = async () => {
            if (!props.userId || !props.projectId) return;

            const userRef = getFirestoreTargetRef(props.userId, mode, workspaceId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return;

            const data = userSnap.data();
            const section = data.projectsSections.find(
                (s: Section) => s.sectionId === props.sectionId
            );

            if (section.time) {
                const timeToSeconds = parseTimeStringToSeconds(section.time);
                setLastStopClockTime(timeToSeconds)
                resetClockTime(timeToSeconds, reset)
            }
        };
        fetchInitialClockTime();

    }, [props.userId, props.projectId, props.sectionId, mode, workspaceId, reset]);

    // Fetch Time Checkouts
    useEffect(() => {
        if (!props.userId || !props.sectionId) return;

        const userRef = getFirestoreTargetRef(props.userId, mode, workspaceId);

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
        <li
            key={props.sectionId}
            className={`w-full rounded-2xl flex flex-col flex-between bg-white relative ${!isAnySections && "pb-1.5"}
             ${(mode === "solo" || userRole === "Member") ? "pt-1.5" : "pt-3"} px-[16px] mb-[8px]`}>
            {/*User Name*/}
            <span
                className={`${isWorkspaceRoleAdmin ? "flex" : "hidden"} items-center text-xs font-semibold absolute top-2 left-2.5 text-custom-gray-800`}>
                    <HiMiniUserCircle className={"text-sm"}/>
                {props.userName}
                </span>
            <div
                className={"flex justify-between gap-10 items-center px-2 h-[52px] border-b-1 border-custom-gray-600"}
            >
                <h1
                    className={"text-base text-black w-2/6"}
                >{props.title}</h1>
                <span
                    className={"text-[20px] font-medium text-black w-2/6"}
                >{newTime}</span>
                <div
                    className={"flex items-center justify-center text-base text-custom-gray-600 gap-[24px]"}>
                    <span className={"w-[1px] h-[36px] bg-custom-gray-600"}/>
                    <>
                        {/*Start & Pause Button*/}
                        <button
                            onClick={() => toggleTimer()}
                            className={`cursor-pointer hover:text-custom-gray-800 duration-150 text-lg`}>
                            {isRunning ? <FiPause/> : <FiPlay/>}
                        </button>
                        <span className={`w-[1px] h-[36px] bg-custom-gray-600`}/>
                    </>
                    {/*Rename Button*/}
                    <button
                        disabled={isRunning}
                        onClick={() => setIsEditModalOpen(true)}
                        className={`${isRunning ? "cursor-not-allowed" : "cursor-pointer hover:text-custom-gray-800"}  duration-150`}
                    >
                        <FiEdit/>
                    </button>
                    <span className={"w-[1px] h-[36px] bg-custom-gray-600"}/>
                    {/*Delete Button*/}
                    <button
                        disabled={isRunning}
                        onClick={() => setIsDeleteModalOpen(true)}
                        className={`${isRunning ? "cursor-not-allowed" : "cursor-pointer hover:text-custom-gray-800"}  duration-150`}
                    >
                        <FiDelete/>
                    </button>
                    <span className={"w-[1px] h-[36px] bg-custom-gray-600"}/>
                </div>
            </div>
            <ul
                className={`${
                    isAnySections ? "flex-1" : "hidden"
                } w-full flex items-center overflow-x-auto overflow-y-hidden gap-3 py-2`}
            >
                {subSections.map((s, index) => (
                    <SubSectionCart
                        key={s.subSectionId}
                        index={index}
                        startTime={s.startTime}
                        stopTime={s.stopTime}
                        clockDifference={s.clockDifference}
                        date={s.date}
                        deleteFunction={() => deleteSubSection(s.subSectionId, s.clockDifference, s.sectionId)}
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
                btnFunction={() => deleteAllSectionData(props.userId, props.projectId, props.sectionId, mode, workspaceId)}
                topDistance={300}
            />
            <RenameModal
                setIsModalOpen={() => setIsEditModalOpen(false)}
                isModalOpen={isEditModalOpen}
                setInputValue={setInputValue}
                inputValue={inputValue}
                title={"Rename track?"}
                inputPlaceholder={"What is new name?"}
                desc={"You can rename your track anytime, anywhere. Name must contain a maximum of 24 characters."}
                formFunction={(e) => {
                    e.preventDefault()
                    editSectionName(props.userId, props.projectId, props.sectionId, inputValue, setInputValue, setIsEditModalOpen, mode, workspaceId)
                }
                }
            />
            <InformativeModal
                isModalOpen={isInfoModalOpen}
                setIsModalOpen={setIsInfoModalOpen}
                title={"You cannot run 2 tracks at the same time."}
            />
        </li>
    )
        ;
};

export default SectionCart;
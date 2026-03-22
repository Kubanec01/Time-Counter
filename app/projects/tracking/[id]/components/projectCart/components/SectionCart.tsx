"use client";

import {doc, getDoc, onSnapshot,} from "firebase/firestore";
import React, {JSX, ReactNode, useEffect, useState} from "react";
import {useStopwatch} from "react-timer-hook";
import {Section, SectionCartProps, TimeCheckout} from "@/types";
import {useClockTimeContext} from "@/features/contexts/clockCountContext";
import {FiPause, FiPlay} from "react-icons/fi";
import {resetClockTime} from "@/features/utilities/time/resetClockTime";
import {createNewTimeCheckout} from "@/features/utilities/create-&-update/createNewTimeCheckout";
import {updateTimeData} from "@/features/utilities/time/updateTimeData";
import {deleteSubsectionAndTimeCheckoutsData} from "@/features/utilities/delete/deleteSubsectionAndTimeCheckoutsData";
import SubSectionCart from "@/app/projects/tracking/[id]/components/projectCart/components/SubSectionCart";
import {formatTimeUnit, updateProjectTotalTime} from "@/features/utilities/time/timeOperations";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {formateDateToYMD, formateYMDToDMY} from "@/features/utilities/date/dateOperations";
import {db} from "@/app/firebase/config";
import {useSectionSettings} from "@/features/hooks/useSectionSettings";
import {updateUserIndividualTime} from "@/features/utilities/create-&-update/updateUserIndividualTime";
import SectionCartContainer from "@/components/SectionCart/SectionCartContainer";
import {LargeButton} from "@/components/LargeButton/LargeButton";
import UserBadge from "@/components/UserBadge/UserBadge";


const SectionCart = ({...props}: SectionCartProps) => {

    const currDate = new Date()

    // States
    const [isRunning, setIsRunning] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [subSections, setSubSections] = useState<TimeCheckout[] | []>([]);
    const [lastStopClockTime, setLastStopClockTime] = useState(0)

    // Context
    const {
        setIsClocktimeRunning,
        isClocktimeRunning,
        setActiveClockTimeSectionId,
        activeClockTimeSectionId
    } = useClockTimeContext()
    const {mode, workspaceId, userRole} = useWorkSpaceContext()

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
        await updateUserIndividualTime(props.userId, workspaceId, props.projectId, formatedDate, durationTime, "decrease")
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
            await updateUserIndividualTime(props.userId, workspaceId, props.projectId, formatedDate, difference, "increase")
        }
    };


    const sectionList: { id: string, content: JSX.Element | ReactNode }[] = [
        {
            id: 'name',
            content: <p>{props.title}</p>
        },
        {
            id: 'type',
            content: <p>{props.type}</p>
        },
        {
            id: 'time',
            content: <p className={"font-semibold"}>{newTime}</p>
        },
        {
            id: 'button',
            content: <>
                <LargeButton
                    onClick={() => toggleTimer()}
                    className={'cursor-pointer p-1 bg-purple-gradient border-vibrant-purple-700 rounded-md pl-4.5 pr-4'}
                    type={'button'}>
                    {isRunning ? <FiPause/> : <FiPlay/>}
                </LargeButton>
            </>
        },
    ]

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
        <SectionCartContainer
            listClassName={userRole === 'Member' ? "" : "pt-5"}
            menuButtonsClassname={isRunning ? 'cursor-not-allowed' : ''}
            bodyClassname={"py-2"}
            sectionList={sectionList}
        >
            <UserBadge
                className={isWorkspaceRoleAdmin ? "flex" : "hidden"}
                userName={props.userName}
            />
            <ul
                className={`${
                    subSections.length > 0 ? "flex-1" : "hidden"} w-full flex flex-col justify-center items-center mt-2`}
            >
                {subSections.map((s) => (
                    <SubSectionCart
                        key={s.subSectionId}
                        startTime={s.startTime}
                        stopTime={s.stopTime}
                        durationTime={s.durationTime}
                        date={formateYMDToDMY(s.date)}
                        deleteFunction={() => deleteSubSection(s.subSectionId, s.durationTime, s.sectionId)}
                    />
                ))}
            </ul>
        </SectionCartContainer>
    )
};

export default SectionCart;

"use client";

import {db} from "@/app/firebase/config";
import DeleteModal from "@/components/modals/DeleteModal";
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc,} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {useStopwatch} from "react-timer-hook";
import {Section, SectionCartProps, TimeCheckout, UpdatedSectionByDate} from "@/types";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import {useFormateTime} from "@/features/hooks/useFormateTime";
import {useTimeOperations} from "@/features/hooks/useTimeOperations";
import {throwRandomNum} from "@/features/throwRandomNum";
import {useClockTimeContext} from "@/features/contexts/clockCountContext";
import SubSectionCart from "@/app/projects/[id]/components/projectCart/components/SubSectionCart";
import InformativeModal from "@/components/modals/InformativeModal";
import {CiPlay1} from "react-icons/ci";
import {FiDelete, FiEdit, FiPause, FiPlay} from "react-icons/fi";


const SectionCart = ({...props}: SectionCartProps) => {

    // States
    const [isRunning, setIsRunning] = useState(false);
    const [btnTittle, setBtnTittle] = useState<"Start" | "Pause">("Start");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [subSections, setSubSections] = useState<TimeCheckout[] | []>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const isAnySections = subSections.length > 0;
    const [lastStopClockTime, setLastStopClockTime] = useState(0)


    // Hooks
    const {seconds, minutes, hours, start, pause, reset, totalSeconds} = useStopwatch({
        autoStart: false,
    });

    const {stringTimeToSeconds, timeSecondsToFormatedString} = useTimeOperations()

    // Context
    const {
        setIsClocktimeRunning,
        isClocktimeRunning,
        setActiveClockTimeSectionId,
        activeClockTimeSectionId
    } = useClockTimeContext()

    const formateTime = useFormateTime()

    // Clock Time
    const newTime = `${formateTime(hours)}:${formateTime(minutes)}:${formateTime(
        seconds
    )}`;

    const resetClockTime = (newClockTimeInSeconds: number) => {

        const newClockTimeToMilliseconds = newClockTimeInSeconds * 1000

        if (newClockTimeToMilliseconds > 0) {
            const currDateToMilliseconds = new Date().getTime()
            const offset = new Date(currDateToMilliseconds + newClockTimeToMilliseconds)
            reset(offset, false)
        } else reset(new Date(), false)
    }

    // Fetch Initial ClockTime
    useEffect(() => {
        const fetchInitialClockTime = async () => {
            if (!props.userId || !props.projectId) return;

            const userRef = doc(db, "users", props.userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return;

            const data = userSnap.data();
            const section = data.projectsSections.find(
                (s: Section) => s.sectionId === props.sectionId
            );

            if (section.time) {
                const timeToSeconds = stringTimeToSeconds(section.time);
                setLastStopClockTime(timeToSeconds)
                resetClockTime(timeToSeconds)
            }
        };
        fetchInitialClockTime();
    }, [props.userId, props.projectId, props.sectionId]);

    // Fetch Time Checkouts SubSections
    useEffect(() => {
        if (!props.userId || !props.sectionId) return;

        const userRef = doc(db, "users", props.userId);

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
    }, [props.userId, props.sectionId]);


    const sendTimeData = async (date: string) => {
        if (!props.userId || !props.projectId) return;

        const userRef = doc(db, "users", props.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const sections = data.projectsSections || [];
        const sectionsByDates = data.updatedSectionsByDates || []

        const updatedSections = sections.map((s: Section) => {
            if (s.sectionId !== props.sectionId) return s;

            return {...s, time: newTime, updateDate: date};
        });

        const updatedSectionsByDates = sectionsByDates.map((s: UpdatedSectionByDate) => {
            if (s.sectionId !== props.sectionId) return s;

            return {...s, date: date}
        })

        const orderedSections = () => {
            const sections: Section[] = []

            for (let i = 0; i < updatedSections.length; i++) {

                const section = updatedSections[i];
                const condition = section.sectionId === props.sectionId;
                if (condition) sections.unshift(section);
                else sections.push(section);

            }

            return sections

        }


        await updateDoc(userRef, {projectsSections: orderedSections()});
        await updateDoc(userRef, {updatedSectionsByDates: updatedSectionsByDates});

    };

    const deleteAllSectionData = async () => {
        if (!props.userId || !props.projectId) return;

        const userRef = doc(db, "users", props.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const sections = data.projectsSections || [];
        const TimeCheckouts = data.timeCheckouts || [];
        const sectionsByDates = data.updatedSectionsByDates || []

        const updatedSections = sections.filter(
            (s: Section) => s.sectionId !== props.sectionId
        );

        const updatedCheckouts = TimeCheckouts.filter(
            (ch: TimeCheckout) => ch.sectionId !== props.sectionId
        );

        const updatedSectionsByDates = sectionsByDates.filter((s: UpdatedSectionByDate) => s.sectionId !== props.sectionId);

        await updateDoc(userRef, {projectsSections: updatedSections});
        await updateDoc(userRef, {timeCheckouts: updatedCheckouts});
        await updateDoc(userRef, {updatedSectionsByDates: updatedSectionsByDates});
    };

    const stopTimeDifference = () => {

        const totalDifferenceToSeconds = totalSeconds - lastStopClockTime

        setLastStopClockTime(totalSeconds)

        return timeSecondsToFormatedString(totalDifferenceToSeconds)

    }

    const createNewTimeCheckout = async (stopTime: string) => {
        if (!props.userId) return;
        const date = new Date()
        const randomNum = throwRandomNum().toString()

        const userRef = doc(db, "users", props.userId);

        const newTimeCheckout: TimeCheckout = {
            sectionId: props.sectionId,
            projectId: props.projectId,
            subSectionId: `subSection_${randomNum}_of_${props.sectionId}`,
            startTime: startTime,
            stopTime: stopTime,
            clockDifference: stopTimeDifference(),
            date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
        };

        await updateDoc(userRef, {timeCheckouts: arrayUnion(newTimeCheckout)});
    };

    const editSectionName = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!props.userId) return

        const userRef = doc(db, "users", props.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const sections = data.projectsSections || []

        const updatedSections = sections.map((s: Section) => {
            if (s.projectId !== props.projectId) return s;
            if (s.sectionId !== props.sectionId) return s;
            return {...s, title: inputValue}
        })
        await updateDoc(userRef, {projectsSections: updatedSections});
        setInputValue("")
        setIsEditModalOpen(false);
    }

    const deleteSubSection = async (subSectionId: string, difference: string, sectionId: string) => {

        if (!props.userId) return
        const userRef = doc(db, "users", props.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const timeCheckouts = data.timeCheckouts || []
        const sections = data.projectsSections || []

        const updatedClockTime = totalSeconds - stringTimeToSeconds(difference)
        const formatedUpdatedClockTime = timeSecondsToFormatedString(updatedClockTime)

        resetClockTime(updatedClockTime)
        setLastStopClockTime(updatedClockTime)

        const updatedCheckouts = timeCheckouts.filter((s: TimeCheckout) => s.subSectionId !== subSectionId)
        const validUpdatedCheckouts = updatedCheckouts.filter((s: TimeCheckout) => s.sectionId === props.sectionId)
        const updatedSections = sections.map((s: Section) => {
            if (s.sectionId !== sectionId) return s;

            return {...s, time: formatedUpdatedClockTime}

        })

        await updateDoc(userRef, {timeCheckouts: updatedCheckouts});
        await updateDoc(userRef, {projectsSections: updatedSections})
        setSubSections(validUpdatedCheckouts);

    }


    const toggleTimer = () => {
        if (isClocktimeRunning && (activeClockTimeSectionId !== props.sectionId)) return setIsInfoModalOpen(true);

        const now = new Date();
        const formattedTime = `${formateTime(now.getHours())}:${formateTime(now.getMinutes())}`;
        const currDateString = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;

        if (!isRunning) {
            setIsClocktimeRunning(true)
            setActiveClockTimeSectionId(props.sectionId)
            setIsRunning(true);
            setStartTime(formattedTime);
            start();
            setBtnTittle("Pause");
        } else {
            setIsClocktimeRunning(false)
            setActiveClockTimeSectionId("")
            setIsRunning(false);
            pause();
            setBtnTittle("Start");
            stopTimeDifference()
            sendTimeData(currDateString);
            createNewTimeCheckout(formattedTime);
            // updateUpdatedClockDate(currDateString)
        }
    };


    return (
        <li
            key={props.sectionId}
            className="w-full rounded-2xl flex flex-col flex-between bg-white h-[150px] px-[16px] mb-[8px]">
            <div
                className={"flex justify-between gap-10 items-center px-2 h-[52px] border-b-1 border-custom-gray-600"}
            >
                <h1
                    className={"text-base text-black"}
                >{props.title}</h1>
                <span
                    className={"text-[20px] font-medium text-black"}
                >{newTime}</span>
                <div
                    className={"flex items-center justify-center text-base text-custom-gray-600 gap-[24px]"}>
                    <span className={"w-[1px] h-[36px] bg-custom-gray-600"}/>
                    <button
                        onClick={() => toggleTimer()}
                        className={"cursor-pointer hover:text-custom-gray-800 duration-150 text-lg"}>
                        {isRunning
                            ?
                            <FiPause/>
                            :
                            <FiPlay/>
                        }
                    </button>
                    <span className={"w-[1px] h-[36px] bg-custom-gray-600"}/>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className={"cursor-pointer hover:text-custom-gray-800 duration-150"}
                    >
                        <FiEdit/>
                    </button>
                    <span className={"w-[1px] h-[36px] bg-custom-gray-600"}/>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className={"cursor-pointer hover:text-custom-gray-800 duration-150"}
                    >
                        <FiDelete/>
                    </button>
                    <span className={"w-[1px] h-[36px] bg-custom-gray-600"}/>
                </div>
                <DeleteModal
                    isModalOpen={isDeleteModalOpen}
                    setIsModalOpen={setIsDeleteModalOpen}
                    title={props.title}
                    btnFunction={deleteAllSectionData}
                />
                <CreateProjectModal
                    setIsModalOpen={() => setIsEditModalOpen(false)}
                    isModalOpen={isEditModalOpen}
                    setInputValue={setInputValue}
                    inputValue={inputValue}
                    title={"Set New Section Name"}
                    formFunction={(e) => editSectionName(e)}
                />
                <InformativeModal
                    isModalOpen={isInfoModalOpen}
                    setIsModalOpen={setIsInfoModalOpen}
                    title={"You cannot run 2 sections at the same time."}
                />
            </div>
            <ul
                className={`${
                    isAnySections ? "flex-1" : "hidden"
                } w-full flex items-center overflow-x-auto overflow-y-hidden gap-3`}
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
        </li>
        // <li
        //     key={props.sectionId}
        //     className="w-full rounded-2xl flex flex-col flex-between bg-white"
        // >
        //     <div className="w-full flex items-center justify-between py-4">
        //         <div className="w-4/12 flex items-center justify-start text-2xl pl-6">
        //             <h1>{props.title}</h1>
        //         </div>
        //         <div className="w-[20%] flex items-center justify-center text-2xl">
        //             <span>{newTime}</span>
        //         </div>
        //         {/* Buttons */}
        //         <div className="w-[50%] flex items-center justify-center gap-10">
        //             <button
        //                 onClick={() => toggleTimer()}
        //                 className="border px-3 py-1 rounded-2xl cursor-pointer"
        //             >
        //                 {btnTittle}
        //             </button>
        //             <button
        //                 onClick={() => setIsDeleteModalOpen(true)}
        //                 className="border px-3 py-1 rounded-2xl cursor-pointer"
        //             >
        //                 Delete
        //             </button>
        //             <button
        //                 onClick={() => setIsEditModalOpen(true)}
        //                 className="border px-3 py-1 rounded-2xl cursor-pointer"
        //             >
        //                 Edit Name
        //             </button>
        //         </div>
        //         <DeleteModal
        //             isModalOpen={isDeleteModalOpen}
        //             setIsModalOpen={setIsDeleteModalOpen}
        //             title={props.title}
        //             btnFunction={deleteAllSectionData}
        //         />
        //         <CreateProjectModal
        //             setIsModalOpen={() => setIsEditModalOpen(false)}
        //             isModalOpen={isEditModalOpen}
        //             setInputValue={setInputValue}
        //             inputValue={inputValue}
        //             title={"Set New Section Name"}
        //             formFunction={(e) => editSectionName(e)}
        //         />
        //         <InformativeModal
        //             isModalOpen={isInfoModalOpen}
        //             setIsModalOpen={setIsInfoModalOpen}
        //             title={"You cannot run 2 sections at the same time."}
        //         />
        //     </div>
        //     <ul
        //         className={`${
        //             isAnySections ? "flex-1" : "hidden"
        //         } w-full pt-2 pb-3 px-6 flex items-center gap-4 overflow-x-auto overflow-y-hidden`}
        //     >
        //         {subSections.map((s, index) => (
        //             <SubSectionCart
        //                 key={s.subSectionId}
        //                 index={index}
        //                 startTime={s.startTime}
        //                 stopTime={s.stopTime}
        //                 clockDifference={s.clockDifference}
        //                 date={s.date}
        //                 deleteFunction={() => deleteSubSection(s.subSectionId, s.clockDifference, s.sectionId)}
        //             />
        //         ))}
        //     </ul>
        // </li>
    );
};

export default SectionCart;
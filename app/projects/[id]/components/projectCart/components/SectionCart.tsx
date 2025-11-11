"use client";

import {db} from "@/app/firebase/config";
import DeleteModal from "@/components/DeleteModal";
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import {useEffect, useState} from "react";
import {useStopwatch} from "react-timer-hook";
import {SectionCartProps, Section, TimeCheckout} from "@/types";
import Modal from "@/components/Modal";

const SectionCart = ({...props}: SectionCartProps) => {

    // React Timer Hook
    const {seconds, minutes, hours, start, pause, reset} = useStopwatch({
        autoStart: false,
    });

    const formateTime = (num: number) => String(num).padStart(2, "0");

    const newTime = `${formateTime(hours)}:${formateTime(minutes)}:${formateTime(
        seconds
    )}`;


    // States
    const [dataTime, setDataTime] = useState<Date | undefined>(undefined);
    const [isRunning, setIsRunning] = useState(false);
    const [btnTittle, setBtnTittle] = useState<"Start" | "Pause">("Start");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [subSections, setSubSections] = useState<TimeCheckout[] | []>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const isAnySections = subSections.length > 0;
    const [lastStopClockTime, setLastStopClockTime] = useState(0)


    // Set Time UseEffect
    useEffect(() => {
        if (dataTime) {
            reset(dataTime, false);
        }
    }, [dataTime, reset]);

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
                const [h, m, s] = section.time.split(":").map(Number);
                const totalSeconds = h * 3600 + m * 60 + s;
                setLastStopClockTime(totalSeconds)

                const currTime = new Date();
                const offset = new Date(currTime.getTime() + totalSeconds * 1005);
                setDataTime(offset);
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


    const sendTimeData = async () => {
        if (!props.userId || !props.projectId) return;

        const userRef = doc(db, "users", props.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const sections = data.projectsSections || [];

        const updatedSections = sections.map((s: Section) => {
            if (s.sectionId !== props.sectionId) return s;

            return {...s, time: newTime};
        });

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
    };

    const deleteProjectSectionAndCheckouts = async () => {
        if (!props.userId || !props.projectId) return;

        const userRef = doc(db, "users", props.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const sections = data.projectsSections || [];
        const TimeCheckouts = data.timeCheckouts || [];

        const updatedSections = sections.filter(
            (s: Section) => s.sectionId !== props.sectionId
        );

        const updatedCheckouts = TimeCheckouts.filter(
            (ch: TimeCheckout) => ch.sectionId !== props.sectionId
        );

        await updateDoc(userRef, {projectsSections: updatedSections});
        await updateDoc(userRef, {timeCheckouts: updatedCheckouts});
    };

    const stopTimeDifference = () => {

        const newTimeToSeconds = () => {
            const time = newTime.split(":").map(Number);
            const [h, m, s] = time
            return (h * 3600 + m * 60 + s)
        }

        const totalDifferenceToSeconds = newTimeToSeconds() - lastStopClockTime

        const differenceToClockFormate = () => {
            const hours = Math.floor(totalDifferenceToSeconds / 3600)
            const minutes = Math.floor((totalDifferenceToSeconds % 3600) / 60)
            const seconds = totalDifferenceToSeconds % 60

            return `${formateTime(hours)}:${formateTime(minutes)}:${formateTime(seconds)}`
        }

        setLastStopClockTime(newTimeToSeconds())

        return differenceToClockFormate()

    }


    const sendTimeCheckout = async (stopTime: string) => {
        if (!props.userId) return;
        const date = new Date()

        const userRef = doc(db, "users", props.userId);

        const newTimeCheckout: TimeCheckout = {
            sectionId: props.sectionId,
            projectId: props.projectId,
            id: subSections.length + 1,
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

    const toggleTimer = () => {
        const now = new Date();
        const formattedTime = `${formateTime(now.getHours())}:${formateTime(now.getMinutes())}`;

        if (!isRunning) {
            setIsRunning(true);
            setStartTime(formattedTime);
            start();
            setBtnTittle("Pause");
        } else {
            setIsRunning(false);
            pause();
            setBtnTittle("Start");
            stopTimeDifference()
            sendTimeData();
            sendTimeCheckout(formattedTime);
        }
    };

    return (
        <li
            key={props.sectionId}
            className="border w-full rounded-2xl flex flex-col flex-between my-4"
        >
            <div className="w-full flex items-center justify-between py-4">
                <div className="w-4/12 flex items-center justify-start text-2xl pl-6">
                    <h1>{props.title}</h1>
                </div>
                <div className="w-[20%] flex items-center justify-center text-2xl">
                    <span>{newTime}</span>
                </div>
                {/* Buttons */}
                <div className="w-[50%] flex items-center justify-center gap-10">
                    <button
                        onClick={() => toggleTimer()}
                        className="border px-3 py-1 rounded-2xl cursor-pointer"
                    >
                        {btnTittle}
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="border px-3 py-1 rounded-2xl cursor-pointer"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="border px-3 py-1 rounded-2xl cursor-pointer"
                    >
                        Edit Name
                    </button>
                </div>
                <DeleteModal
                    isModalOpen={isDeleteModalOpen}
                    setIsModalOpen={setIsDeleteModalOpen}
                    title={props.title}
                    btnFunction={deleteProjectSectionAndCheckouts}
                />
                <Modal
                    setIsModalOpen={() => setIsEditModalOpen(false)}
                    isModalOpen={isEditModalOpen}
                    setInputValue={setInputValue}
                    inputValue={inputValue}
                    title={"Set New Section Name"}
                    formFunction={(e) => editSectionName(e)}
                />
            </div>
            <ul
                className={`${
                    isAnySections ? "flex-1" : "hidden"
                } w-full pt-2 pb-3 px-6 flex items-center gap-4 overflow-x-auto overflow-y-hidden`}
            >
                {subSections.map((s, index) => (
                    <li
                        key={index}
                        className="border w-[150px] h-[100px] rounded-xl shrink-0 flex flex-col justify-between items-start p-2"
                    >
                        <span className="font-semibold">
                        h: {s.startTime} - {s.stopTime}
                        </span>
                        <span className="font-semibold">t: {s.clockDifference}</span>
                        <span className="font-semibold">d: {s.date}</span>
                    </li>
                ))}
            </ul>
        </li>
    );
};

export default SectionCart;

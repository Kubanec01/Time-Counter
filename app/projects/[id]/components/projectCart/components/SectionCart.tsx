"use client";

import { db } from "@/app/firebase/config";
import DeleteModal from "@/components/DeleteModal";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { Project, SectionCartProps, Section, TimeCheckout } from "@/types";

const SectionCart = ({ ...props }: SectionCartProps) => {
  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  const [dataTime, setDataTime] = useState<Date | undefined>(undefined);

  const [isRunning, setIsRunning] = useState(false);
  const [btnTittle, setBtnTittle] = useState<"Start" | "Pause">("Start");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [subSections, setSubSections] = useState<TimeCheckout[] | []>([]);

  const formateTime = (num: number) => String(num).padStart(2, "0");

    const newTime = `${formateTime(hours)}:${formateTime(minutes)}:${formateTime(
        seconds
    )}`;

  // Set Time UseEffect
  useEffect(() => {
    if (dataTime) {
      reset(dataTime, false);
    }
  }, [dataTime, reset]);

  const isAnySections = subSections.length > 0 ? true : false;

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

        const currTime = new Date();
        const offset = new Date(currTime.getTime() + totalSeconds * 1005);
        setDataTime(offset);
      }
    };
    fetchInitialClockTime();
  }, [props.userId, props.projectId, props.sectionId]);

  // Fetch Time Checkouts SubSection
  useEffect(() => {
    if (!props.userId || !props.sectionId) return;

    const userRef = doc(db, "users", props.userId);

    const fetchTimeCheckouts = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      const timeCheckouts = data.timeCheckouts.filter(
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

      return { ...s, time: newTime };
    });

    await updateDoc(userRef, { projectsSections: updatedSections });
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

    await updateDoc(userRef, { projectsSections: updatedSections });
    await updateDoc(userRef, { timeCheckouts: updatedCheckouts });
  };

  const sendTimeCheckout = async (stopTime: string) => {
    if (!props.userId) return;
    const date = new Date();

    const userRef = doc(db, "users", props.userId);

    const newTimeCheckout: TimeCheckout = {
      sectionId: props.sectionId,
      id: subSections.length + 1,
      startTime: startTime,
      stopTime: stopTime,
      clockTime: newTime,
      date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
    };

    await updateDoc(userRef, { timeCheckouts: arrayUnion(newTimeCheckout) });
  };

  const toggleTimer = () => {
    const now = new Date();
    const formattedTime = `${now.getHours()}:${now.getMinutes()}`;

    if (!isRunning) {
      setIsRunning(true);
      setStartTime(formattedTime);
      start();
      setBtnTittle("Pause");
    } else {
      setIsRunning(false);
      pause();
      setBtnTittle("Start");
      sendTimeData();
      sendTimeCheckout(formattedTime);
    }
  };

  return (
    <li
      key={props.sectionId}
      className="border w-full rounded-2xl flex flex-col flex-between"
    >
      <div className="w-full flex items-center justify-between py-4">
        <div className="w-4/12 flex items-center justify-start text-2xl pl-6">
          <h1>{props.title}</h1>
        </div>
        <div className="w-4/12 flex items-center justify-center text-2xl">
          <span>{newTime}</span>
        </div>
        <div className="w-4/12 flex items-center justify-center gap-10">
          <button
            onClick={() => toggleTimer()}
            className="border px-3 py-1 rounded-2xl cursor-pointer"
          >
            {btnTittle}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="border px-3 py-1 rounded-2xl cursor-pointer"
          >
            Delete
          </button>
        </div>
        <DeleteModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          title={props.title}
          btnFunction={deleteProjectSectionAndCheckouts}
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
            <span className="font-semibold">t: {s.clockTime}</span>
            <span className="font-semibold">d: {s.date}</span>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default SectionCart;

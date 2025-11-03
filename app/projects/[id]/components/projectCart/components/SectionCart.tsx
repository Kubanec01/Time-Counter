"use client";

import { db } from "@/app/firebase/config";
import DeleteModal from "@/components/DeleteModal";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";

interface SectionCart {
  sectionId: string;
  title: string;
  userId: string | null;
  // time: string;
}

interface Section {
  id: string;
  title: string;
  time: string;
}

interface Project {
  id: string;
  title: string;
  sections?: Section[];
}

const SectionCart = ({ ...props }: SectionCart) => {
  const params = useParams();
  const projectId = params.id;

  const [dataTime, setDataTime] = useState<Date | undefined>(undefined);

  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [btnTittle, setBtnTittle] = useState<"Start" | "Pause">("Start");

  const [isModalOpen, setIsModalOpen] = useState(false);

  let newTime = `${hours.toString()}:${minutes.toString()}:${seconds.toString()}`;

  const sendData = async () => {
    if (!props.userId || !projectId) return;

    const userRef = doc(db, "users", props.userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const projects: Project[] = userData.projects || [];

      const updateProjects = projects.map((p: Project) => {
        if (p.id !== projectId) return p;

        const updatedSection = p.sections?.map((s: Section) => {
          if (s.id === props.sectionId) {
            return { ...s, time: newTime };
          }
          return s;
        });
        return { ...p, sections: updatedSection };
      });

      await updateDoc(userRef, {
        projects: updateProjects,
      });
    }
  };

  const toggleTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      start();
      setBtnTittle("Pause");
    } else {
      setIsRunning(false);
      pause();
      setBtnTittle("Start");
      sendData();
    }
  };

  // Fetch Time UseEffect
  useEffect(() => {
    const fetchInitialTime = async () => {
      if (!props.userId || !projectId) return;

      const userRef = doc(db, "users", props.userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const project = data.projects.find((p: Project) => p.id === projectId);
        const section: Section = project.sections.find(
          (s: Section) => s.id === props.sectionId
        );

        if (section.time) {
          const [h, m, s] = section.time.split(":").map(Number);
          const totalSeconds = h * 3600 + m * 60 + s;

          const currTime = new Date();
          const offset = new Date(currTime.getTime() + totalSeconds * 1010);
          setDataTime(offset);
        }
      }
    };
    fetchInitialTime();
  }, [props.userId, projectId, props.sectionId]);

  // Set Time UseEffect
  useEffect(() => {
    if (dataTime) {
      reset(dataTime, false);
    }
  }, [dataTime, reset]);

  const deleteSection = async () => {
    if (!props.userId || !projectId) return;

    const userRef = doc(db, "users", props.userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const projects = data.projects || [];

      const updatedProjects = projects.map((p: Project) => {
        if (p.id !== projectId) return p;

        const updatedSections = p.sections?.filter(
          (s: Section) => s.id !== props.sectionId
        );

        return { ...p, sections: updatedSections };
      });
      await setDoc(userRef, { projects: updatedProjects });
    }

    setIsModalOpen(false);
  };

  return (
    <li
      key={props.sectionId}
      className="border w-full h-18 rounded-2xl flex items-center justify-between"
    >
      <div className="w-4/12 flex items-center justify-start text-2xl pl-16">
        <h1>{props.title}</h1>
      </div>
      <div className="w-4/12 flex items-center justify-center text-2xl">
        <span>{newTime}</span>
      </div>
      <div className="w-4/12 flex items-center justify-center gap-10">
        <button
          onClick={toggleTimer}
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
        btnFunction={() => deleteSection()}
      />
    </li>
  );
};

export default SectionCart;

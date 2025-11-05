"use client";

import { auth, db } from "@/app/firebase/config";
import Modal from "@/components/Modal";
import { onAuthStateChanged } from "firebase/auth";
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
import SectionCart from "./components/SectionCart";
import { Project, projectProps, Section } from "@/types";

const ProjectCart = ({ ...props }: projectProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  const projectId = props.id;

  // CallbackUser Function
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });

    return () => unsubAuth();
  }, []);

  const createSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) return;

    const newSection = {
      projectId: projectId,
      sectionId: inputValue.replace(/\s+/g, ""),
      title: inputValue,
      time: "0:0:0",
    };

    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, { projectsSections: arrayUnion(newSection) });
    setInputValue("");
  };

  useEffect(() => {
    if (!userId || !projectId) return;
    const userRef = doc(db, "users", userId);

    const getSectionsData = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const sections = data.projectsSections || [];

        const validSections = sections.filter(
          (s: Section) => s.projectId === projectId
        );
        setSections(validSections);
      } else setSections([]);
    });

    return () => getSectionsData();
  }, [userId, projectId]);

  return (
    <div className="border max-w-[1200px] w-11/12 h-[700px] m-auto rounded-3xl overflow-hidden flex flex-col">
      <div className="w-full flex justify-center items-center flex-col gap-6">
        <h1 className="text-center mx-auto text-4xl mt-10">{props.id}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="border px-2 py-1 rounded-2xl mx-auto cursor-pointer"
        >
          Add Section
        </button>
      </div>
      <ul className="border flex-1 mt-10 px-6 py-2">
        {sections.length > 0 ? (
          <>
            {sections.map((i) => (
              <SectionCart
                key={i.sectionId}
                sectionId={i.sectionId}
                projectId={i.projectId}
                title={i.title}
                userId={userId}
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </ul>
      <Modal
        title="Section"
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        setInputValue={setInputValue}
        inputValue={inputValue}
        formFunction={createSection}
      />
    </div>
  );
};

export default ProjectCart;

"use client";

import {auth, db} from "@/app/firebase/config";
import Modal from "@/components/Modal";
import {onAuthStateChanged} from "firebase/auth";
import {
    arrayUnion,
    doc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import SectionCart from "./components/SectionCart";
import {Project, projectProps, Section} from "@/types";
import {throwRandomNum} from "@/features/throwRandomNum";

const ProjectCart = ({...props}: projectProps) => {
    // States
    const [sections, setSections] = useState<Section[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [projectName, setProjectName] = useState<string | null>(null);

    // Variables
    const projectId = props.id;


    // CallbackUser Function
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            setUserId(user?.uid || undefined);
        });

        return () => unsubAuth();
    }, []);

    // Fetch Sections Data
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

    // Fetch Project Name
    useEffect(() => {
        if (!userId || !projectId) return;
        const userRef = doc(db, "users", userId);

        const fetchProjectName = onSnapshot(userRef, snap => {
            if (!snap.exists()) return

            const data = snap.data();
            const projects = data.projects || []
            const currProject = projects.find((p: Project) => p.projectId === projectId);

            setProjectName(currProject.title)
        })

        return () => fetchProjectName()

    }, [userId, projectId]);

    const createNewSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userId) return;
        const userRef = doc(db, "users", userId);

        // Random Num Variable
        const randomNum = throwRandomNum().toString()

        const newSection = {
            projectId: projectId,
            sectionId: `${inputValue.replace(/\s+/g, "")}_${randomNum}`,
            title: inputValue,
            time: "00:00:00",
        };


        await updateDoc(userRef, {projectsSections: arrayUnion(newSection)});
        setInputValue("");
    };

    return (
        <div className="border max-w-[1200px] w-11/12 h-[700px] m-auto rounded-3xl flex flex-col">
            <div className="w-full flex justify-center items-center flex-col gap-6">
                <h1 className="text-center mx-auto text-4xl mt-10">{projectName}</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="border px-2 py-1 rounded-2xl mx-auto cursor-pointer"
                >
                    Add Section
                </button>
            </div>
            <ul className="border flex-1 mt-10 px-6 py-2 overflow-y-auto">
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
                formFunction={createNewSection}
            />
        </div>
    );
};

export default ProjectCart;

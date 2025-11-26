"use client";

import {auth, db} from "@/app/firebase/config";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import {onAuthStateChanged} from "firebase/auth";
import {
    arrayUnion,
    doc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import SectionCart from "./components/SectionCart";
import {Project, projectProps, Section, UpdatedSectionByDate} from "@/types";
import {throwRandomNum} from "@/features/throwRandomNum";
import {useRouter} from "next/navigation";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";

const ProjectCart = ({...props}: projectProps) => {
    // States
    const [sections, setSections] = useState<Section[]>([]);
    const [updatedSectionsByDates, setUpdatedSectionsByDates] = useState<string[]>([]);
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
                const updatedSectionsByDates = data.updatedSectionsByDates || []

                const validUpdatedSectionByDates: UpdatedSectionByDate[] = updatedSectionsByDates.filter((s: UpdatedSectionByDate) => s.projectId === projectId);

                const validSections = sections.filter(
                    (s: Section) => s.projectId === projectId
                );

                const datesSections = (arr: UpdatedSectionByDate[]) => {
                    if (arr.length === 0) return []

                    let newDate = arr[0].date
                    const newArr = [arr[0].date]

                    for (let i = 1; i < arr.length; i++) {
                        let isUnique = true
                        const date = arr[i].date;

                        for (let j = 0; j < newArr.length; j++) {
                            if (date === newDate || date === newArr[j]) {
                                isUnique = false
                                break
                            }
                        }
                        if (isUnique) {
                            newArr.push(date)
                            newDate = date
                        }
                    }
                    return newArr
                }

                setSections(validSections);
                setUpdatedSectionsByDates(datesSections(validUpdatedSectionByDates))

            } else {
                setSections([])
                setUpdatedSectionsByDates([])
            }

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
        const sectionId = `${inputValue.replace(/\s+/g, "")}_${randomNum}`

        // Curr Date Variable
        const date = new Date()
        const currDate: string = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`


        const newSection: Section = {
            projectId: projectId,
            sectionId: sectionId,
            title: inputValue,
            time: "00:00:00",
            updateDate: currDate
        };

        const newSectionUpdate: UpdatedSectionByDate = {
            projectId: projectId,
            sectionId: sectionId,
            date: currDate,
        }

        await updateDoc(userRef, {projectsSections: arrayUnion(newSection)});
        await updateDoc(userRef, {updatedSectionsByDates: arrayUnion(newSectionUpdate)})
        setInputValue("");
    };

    const setSectionName = (sectionName: string) => {
        let sectionValidName = ""

        const date = new Date()
        const todayDateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
        const yesterdayDateString = `${date.getDate() - 1}.${date.getMonth() + 1}.${date.getFullYear()}`

        if (sectionName === todayDateString) {
            sectionValidName = "Today"
        } else if (sectionName === yesterdayDateString) {
            sectionValidName = "Yesterday"
        } else sectionValidName = sectionName

        return sectionValidName
    }

    const setSectionColor = (sectionName: string) => {

        const date = new Date()
        const todayDateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`

        if (sectionName === todayDateString) {
            return "bg-pastel-pink-700"
        } else return `bg-pastel-green-700`
    }

    return (
        <>
            <ProjectCartNavbar projectName={projectName}/>
            <section
                className={"w-[90%] max-w-[776px] mx-auto pt-[198px] border-b-2 border-custom-gray-600 pb-3 px-20"}
            >
                <form
                    onSubmit={createNewSection}
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
                <ul className="w-full">
                    {updatedSectionsByDates.length > 0
                        ?
                        <>
                            {updatedSectionsByDates.map((section, index) => (
                                <ul
                                    className={`w-full px-[12px] pt-[12px] pb-[4px] rounded-[12px] ${setSectionColor(section)}`}
                                    key={index}>
                                    <h1
                                        className={"text-sm text-custom-gray-800  ml-[24px] mb-[12px]"}
                                    >
                                        {setSectionName(section)}
                                    </h1>
                                    {sections.map((i) => {
                                        if (i.updateDate === section) {
                                            return (
                                                <SectionCart
                                                    key={i.sectionId}
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
        </>
    );
};

export default ProjectCart;

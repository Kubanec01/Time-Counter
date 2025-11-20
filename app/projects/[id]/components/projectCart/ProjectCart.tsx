"use client";

import {auth, db} from "@/app/firebase/config";
import FormModal from "@/components/modals/FormModal";
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

const ProjectCart = ({...props}: projectProps) => {
    // States
    const [sections, setSections] = useState<Section[]>([]);
    const [updatedSectionsByDates, setUpdatedSectionsByDates] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [projectName, setProjectName] = useState<string | null>(null);

    // Router
    const router = useRouter();

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

    return (
        <>
            <button
                onClick={() => router.replace("/")}
                className={"absolute top-[30px] left-[50%] -translate-x-[50%] border w-[100px] h-[34px] rounded-2xl cursor-pointer"}
            >
                Go Back
            </button>
            <div className="border max-w-[1200px] w-11/12 h-[700px] m-auto rounded-3xl flex flex-col overflow-hidden">
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
                    {updatedSectionsByDates.length > 0
                        ?
                        <>
                            {updatedSectionsByDates.map((section, index) => (
                                <ul
                                    className={"mb-7"}
                                    key={index}>
                                    <h1
                                        className={"border-b-2 border-gray-600 -mb-1 text-lg text-gray-600"}
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
                            className={"w-full h-full flex justify-center items-center text-2xl text-gray-500"}>
                            You have no sections created.
                        </h1>

                    }
                </ul>
                <FormModal
                    title="Create New Section"
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                    setInputValue={setInputValue}
                    inputValue={inputValue}
                    formFunction={createNewSection}
                />
            </div>
        </>
    );
};

export default ProjectCart;

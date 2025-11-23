"use client";

import FormModal from "@/components/modals/FormModal";
import ProjectsBars from "@/components/ProjectsBars";
import {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useRouter} from "next/navigation";
import {signOut} from "firebase/auth";
import {arrayUnion, updateDoc} from "firebase/firestore";
import {useGetUserDatabase} from "@/features/hooks/useGetUserDatabase";
import {throwRandomNum} from "@/features/throwRandomNum";

export default function HomePage() {

    // User Data
    const {userRef} = useGetUserDatabase()


    //   States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");


    const createNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userRef) return;

        // Random Num Variable
        const randomNum = throwRandomNum().toString();

        const newProject = {
            projectId: `${inputValue.replace(/\s+/g, "")}_${randomNum}`,
            title: inputValue,
        };

        setInputValue("");
        setIsModalOpen(false);

        await updateDoc(userRef, {
            projects: arrayUnion(newProject),
        });
    };


    // Auth Route Function
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/sign-in");
        }
    }, [user, loading, router]);

    return (
        <>
            {/*Projects Hero*/}
            <section
                className={"flex justify-between items-center w-[90%] max-w-[1144px] mt-[180px] mx-auto border-b-2 border-gray-200 px-[94px]"}
            >
                {/*Left Side*/}
                <div
                    className={`flex items-center justify-center`}>
                    <h1
                        className={"text-[48px] font-medium"}
                    >Projects</h1>
                    <p
                        className={"text-base text-custom-gray-800 font-medium -mb-4 ml-4"}>
                        See all started projects</p>
                </div>
                <div
                    className={`flex items-center justify-center`}>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={"text-base px-[20px] py-3.5 text-white hover:text-black" +
                            " bg-black hover:bg-white border-2 cursor-pointer duration-150 ease-in-out border-black rounded-[1000px] font-medium"}>
                        Create project
                    </button>
                    <p
                        className={"text-base text-custom-gray-800 font-medium -mb-4 ml-4"}>
                        And build what moves you</p>
                </div>
                <ProjectsBars/>
                <FormModal
                    title="Project"
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                    setInputValue={setInputValue}
                    inputValue={inputValue}
                    formFunction={createNewProject}
                />
            </section>
        </>
    );
}

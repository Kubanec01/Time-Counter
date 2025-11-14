"use client";

import Modal from "@/components/Modal";
import ProjectsBars from "@/components/ProjectsBars";
import {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useRouter} from "next/navigation";
import {signOut} from "firebase/auth";
import {arrayUnion, updateDoc} from "firebase/firestore";
import {useGetUserDatabase} from "@/hooks/useGetUserDatabase";


export default function Home() {

    // User Data
    const {userRef} = useGetUserDatabase()


    //   States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");


    const createNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userRef) return;

        // Random Num Variable
        const randomNum = Math.floor(Date.now() * Math.random() % 10_000_000).toString();

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
        <section className="text-4xl w-full h-screen flex flex-col justify-center items-center">
            <button
                className="text-xl -mt-5 mb-10 text-red-600 cursor-pointer"
                onClick={() => signOut(auth)}
            >
                Log Out
            </button>
            <div className="w-11/12 max-w-[1300px] border-2 rounded-2xl border-[#d9d9d9] h-[800px]">
                <div className="h-[40%] w-full flex flex-col justify-start items-center">
                    <h1 className="text-7xl mt-20">Projects</h1>
                    <button
                        onClick={() => setIsModalOpen((v) => !v)}
                        className="mt-10 border-2 rounded-2xl text-base px-4 py-1 text-blue-600 cursor-pointer"
                    >
                        Add Project
                    </button>
                </div>
                <ProjectsBars/>
            </div>
            <Modal
                title="Project"
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                setInputValue={setInputValue}
                inputValue={inputValue}
                formFunction={createNewProject}
            />
        </section>
    );
}

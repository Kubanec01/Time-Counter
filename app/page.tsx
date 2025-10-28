"use client";

import Modal from "@/components/Modal";
import ProjectsBars from "@/components/ProjectsBars";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [inputValue, setInputValue] = useState<string>("");

  const router = useRouter();

  const userId = auth.currentUser?.uid;

  const createNewData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) return;

    const useRef = doc(db, "users", userId);

    const newProject = {
      id: inputValue.replace(/\s+/g, ""),
      title: inputValue,
      sections: [],
    };

    setInputValue("");
    setIsModalOpen(false);

    await updateDoc(useRef, {
      projects: arrayUnion(newProject),
    });
  };

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
        <ProjectsBars />
      </div>
      <Modal
        title="Project"
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        setInputValue={setInputValue}
        inputValue={inputValue}
        formFunction={createNewData}
      />
    </section>
  );
}

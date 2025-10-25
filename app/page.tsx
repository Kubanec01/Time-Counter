"use client";

import Modal from "@/components/Modal";
import ProjectsBars from "@/components/ProjectsBars";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="text-4xl w-full h-screen flex justify-center items-center">
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
      />
    </section>
  );
}

import { auth, db } from "@/app/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const ProjectsBars = () => {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const useRef = doc(db, "users", userId);

    const fetchProjects = onSnapshot(useRef, (userSnap) => {
      if (userSnap.exists()) {
        const data = userSnap.data();
        setProjectsData(data.projects || []);
      } else {
        setProjectsData([]);
      }
    });

    return () => fetchProjects();
  }, [userId]);

  return (
    <section className="w-full h-[60%] flex justify-center items-center gap-5">
      {projectsData.length < 1 ? (
        <h1 className="text-[#9e9e9e]">You have no projects created.</h1>
      ) : (
        projectsData.map((project, index) => (
          <div
            key={project.id}
            className="border w-[300px] h-full rounded-2xl flex flex-col justify-center items-center"
          >
            <h1 className="mb-16 text-center text-2xl">{project.title}</h1>
            <Link
            href={`/projects/${project.id}`}
            className=" text-base py-2 px-4 rounded-2xl cursor-pointer bg-blue-600 text-white">
              Enter Project
            </Link>
          </div>
        ))
      )}
    </section>
  );
};

export default ProjectsBars;

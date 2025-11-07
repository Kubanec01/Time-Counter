import { auth, db } from "@/app/firebase/config";
import {Project, Section, TimeCheckout} from "@/types";
import {doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";


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

  const deleteProject = async (projectId: string) => {
      if(!userId) return

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
          const data = userSnap.data();
          const projects = data?.projects || []
          const projectsSections = data?.projectsSections || [];
          const timeCheckouts = data?.timeCheckouts || [];
          const updatedProjects = projects.filter((p: Project) => p.projectId !== projectId);
          const updatedProjectsSections = projectsSections.filter((s: Section) => s.projectId !== projectId);
          const updatedTimeCheckouts = timeCheckouts.filter((t: TimeCheckout) => t.projectId !== projectId );
          await updateDoc(userRef, {projects: updatedProjects, projectsSections: updatedProjectsSections, timeCheckouts: updatedTimeCheckouts});
      }
  }


  return (
    <section className="w-full h-[60%] flex justify-center items-center gap-5">
      {projectsData.length < 1 ? (
        <h1 className="text-[#9e9e9e]">You have no projects created.</h1>
      ) : (
        projectsData.map((project) => (
          <div
            key={project.projectId}
            className="border w-[300px] h-full rounded-2xl flex flex-col justify-center items-center"
          >
            <h1 className="mb-16 text-center text-2xl">{project.title}</h1>
            <Link
            href={`/projects/${project.projectId}`}
            className=" text-base py-2 px-4 rounded-2xl cursor-pointer bg-blue-600 text-white">
              Enter Project
            </Link>
              <button
                  onClick={() => deleteProject(project.projectId)}
              className="text-xl px-4 py-1 rounded-xl mt-4 bg-red-500 text-[white] cursor-pointer"
              >
                  Delete
              </button>
          </div>
        ))
      )}
    </section>
  );
};

export default ProjectsBars;

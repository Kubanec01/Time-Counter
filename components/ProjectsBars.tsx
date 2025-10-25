import { projects } from "@/data/projects";
import { useState } from "react";

const ProjectsBars = () => {
  const [projectsData, setProjectsData] = useState(projects);

  console.log("This is useState =>", projectsData.length);
  console.log("This is useState =>", projects.length);

  // Delete Project Function
  const deleteDataItem = (index: number) => {
    console.log("button was clicked");
    const currProjects = [...projectsData];
    currProjects.splice(index, 1);
    setProjectsData(currProjects);
  };

//   ! vo vykreslovani a mazani sa bez servera vobec nepohnem v tomto

  return (
    <section className="w-full h-[60%] flex justify-center items-center gap-5">
      {projectsData.length < 1 ? (
        <>
          <h1 className="text-[#9e9e9e]">You have no projects created.</h1>
        </>
      ) : (
        <>
          {projectsData.map((project, index) => (
            <div
              key={project.id}
              className="border w-[300px] h-full rounded-2xl flex flex-col justify-center items-center"
            >
              <h1 className="mb-16 text-center text-2xl">{project.title}</h1>
              <button className=" text-base py-2 px-4 rounded-2xl cursor-pointer bg-blue-600 text-white">
                Enter Project
              </button>
              <button
                onClick={() => deleteDataItem(index)}
                className=" text-base py-2 px-4 rounded-2xl mt-6 cursor-pointer bg-red-600 text-white"
              >
                Delete Project
              </button>
            </div>
          ))}
        </>
      )}
    </section>
  );
};

export default ProjectsBars;

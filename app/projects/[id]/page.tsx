"use client";

import { useParams } from "next/navigation";
import ProjectCart from "./components/projectCart/ProjectCart";

const ProjectPage = () => {
  const {id} = useParams();
  return (
    <section className="w-full">
      <ProjectCart id={id!.toString()} />
    </section>
  );
};

export default ProjectPage;

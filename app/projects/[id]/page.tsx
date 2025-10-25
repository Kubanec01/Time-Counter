"use client";

import { useParams } from "next/navigation";
import ProjectCart from "./components/ProjectCart";

const page = () => {
  const params = useParams();
  const id = params.id;

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <ProjectCart id={id!.toString()} />
    </section>
  );
};

export default page;

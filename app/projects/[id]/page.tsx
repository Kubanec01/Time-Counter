"use client";

import { useParams } from "next/navigation";
import ProjectCart from "./components/projectCart/ProjectCart";

const page = () => {
  const {id} = useParams();
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <ProjectCart id={id!.toString()} />
    </section>
  );
};

export default page;

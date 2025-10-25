import { projects } from "@/data/projects";

interface projectProps {
  id: string;
}

const ProjectCart = ({ ...props }: projectProps) => {
  const project = projects.find((i) => i.id === props.id);

  if (!project) return;

  return (
    <div className="border max-w-[1200px] w-11/12 h-[700px] m-auto rounded-3xl overflow-hidden flex flex-col">
      <div className="w-full flex justify-center items-center flex-col gap-6">
        <h1 className="text-center mx-auto text-4xl mt-10">{project.title}</h1>
        <button className="border px-2 py-1 rounded-2xl mx-auto cursor-pointer">
          Add Section
        </button>
      </div>
      <ul className="border flex-1 mt-10 px-6 py-2">
        {project.sections.map((i) => (
          <li className="border w-full h-18 rounded-2xl flex items-center justify-between">
            <div className="w-4/12 flex items-center justify-start text-2xl pl-16">
              <h1>{i.title}</h1>
            </div>
            <div className="w-4/12 flex items-center justify-center text-2xl">
              <span>{i.time}</span>
            </div>
            <div className="w-4/12 flex items-center justify-center gap-10">
              <button className="border px-3 py-1 rounded-2xl cursor-pointer">
                Start/Stop
              </button>
              <button className="border px-3 py-1 rounded-2xl cursor-pointer">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectCart;

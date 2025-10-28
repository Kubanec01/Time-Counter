import { auth, db } from "@/app/firebase/config";
import Modal from "@/components/Modal";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface projectProps {
  id: string;
}

interface Section {
  id: string;
  title: string;
  time: string;
}

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

const ProjectCart = ({ ...props }: projectProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const params = useParams();
  const userId = auth.currentUser?.uid;
  const projectId = params.id;

  const createNewData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId || !projectId) return;

    const newSection: Section = {
      id: inputValue.replace(/\s+/g, ""),
      title: inputValue.toUpperCase(),
      time: "00:00:00",
    };

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const projects = userData.projects || [];

      const updatedProjects = projects.map((p: Project) =>
        p.id === projectId
          ? { ...p, sections: [...(p.sections || []), newSection] }
          : p
      );

      await setDoc(userRef, { projects: updatedProjects }, { merge: true });
    }

    setInputValue("");
    setIsModalOpen(false);
  };

  // Load Sections Data
  useEffect(() => {
    if (!userId || !projectId) return;

    const userRef = doc(db, "users", userId);

    const fetchSections = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const projects = data.projects || [];

        const project = projects.find((p: Project) => p.id === projectId);
        setSections(project.sections || []);
      } else {
        setSections([]);
      }
    });

    return () => fetchSections();
  }, [userId, projectId]);

  return (
    <div className="border max-w-[1200px] w-11/12 h-[700px] m-auto rounded-3xl overflow-hidden flex flex-col">
      <div className="w-full flex justify-center items-center flex-col gap-6">
        <h1 className="text-center mx-auto text-4xl mt-10">{props.id}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="border px-2 py-1 rounded-2xl mx-auto cursor-pointer"
        >
          Add Section
        </button>
      </div>
      <ul className="border flex-1 mt-10 px-6 py-2">
        {sections.length > 0 ? (
          <>
            {sections.map((i) => (
              <li
                key={i.id}
                className="border w-full h-18 rounded-2xl flex items-center justify-between"
              >
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
          </>
        ) : (
          <></>
        )}
      </ul>
      <Modal
        title="Section"
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        setInputValue={setInputValue}
        inputValue={inputValue}
        formFunction={createNewData}
      />
    </div>
  );
};

export default ProjectCart;

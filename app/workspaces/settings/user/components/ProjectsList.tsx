import {Project} from "@/types";
import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";
import {getAllProjects} from "@/features/utilities/getAllProjects";
import {LargeButton} from "@/components/LargeButton/LargeButton";
import {useRouter} from "next/navigation";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";

type ProjectsListProps = {
    workspaceId: string;
    userId: string;
    workspaceData: DocumentData
}

const ProjectsList = ({...props}: ProjectsListProps) => {

    const [listProjects, setListProjects] = useState<Project[]>([]);
    const router = useRouter()

    useEffect(() => {

        const fetchData = async () => {

            const projects = await getAllProjects(props.workspaceId)
            const filteredProjects = projects.filter(project => project.membersList.find(memberId => memberId === props.userId))

            setListProjects(filteredProjects)
        }

        fetchData().catch(err => console.log(err.message))

    }, [props.workspaceId, props.userId])

    return (
        <ul
            className={"px-4 h-[300px] overflow-y-auto"}
        >
            {listProjects.map((project: Project) => (
                <li
                    key={project.projectId}
                >
                    <LargeButton
                        className={"border mb-2 w-full flex items-center justify-between bg-linear-to-b from-vibrant-purple-300/40 to-vibrant-purple-300/40 border-vibrant-purple-300" +
                            " hover:from-vibrant-purple-300/70 duration-150"}
                        type={'button'}
                        onClick={() => router.push(`/projects/logging/${project.projectId}`)}
                    >
                        <>
                            <div
                                className={"flex items-center gap-3"}
                            >
                            <span
                                className={"py-1 px-1.5 rounded-md text-purple-950 font-medium bg-vibrant-purple-300/80"}
                            >
                                {project.title.slice(0, 1).toUpperCase()}{project.title.slice(-1).toUpperCase()}
                            </span>
                                <p
                                    className={"text-purple-950 font-medium truncate w-[60%]"}
                                >
                                    {project.title}
                                </p>
                            </div>
                            <p
                                className={"text-black/56 font-semibold text-xs"}
                            >
                                {formatSecondsToTimeString(project.totalTime)}
                            </p>
                        </>
                    </LargeButton>
                </li>
            ))}
        </ul>
    )
}

export default ProjectsList
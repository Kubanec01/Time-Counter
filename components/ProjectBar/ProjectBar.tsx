import React from "react";
import {useRouter} from "next/navigation";
import {useProjectData} from "@/features/hooks/useProjectData";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {db} from "../../app/config/firebase/config";
import {enterProjectMainPageUrlPath} from "@/data/Url_Paths/urlPaths";

type ProjectBarProps = {
    userId: string | undefined;
    projectId: string;
    title: string;
    workspaceId: string
    projectTotalTimeString: string;
    membersValue: number
}

export const ProjectBar = ({...props}: ProjectBarProps) => {

    const {project} = useProjectData(props.workspaceId, props.projectId)
    const router = useRouter();

    const enterProject = async () => {
        if (!project || !props.userId) return
        const replaceToProject = () => router.push(enterProjectMainPageUrlPath(project.type, project.projectId));

        const isUserInMembersList = project.membersList.find(user => user === props.userId)
        if (isUserInMembersList) return replaceToProject()
        else {
            const docRef = doc(db, "realms", props.workspaceId, "projects", props.projectId)
            replaceToProject()
            await updateDoc(docRef, {membersList: arrayUnion(props.userId)})
        }
    }

    return (
        <>
            <div
                onClick={() => enterProject()}
                className={"cursor-pointer ease-in border mb-4 border-black/20 dark:border-white/20 shadow-md rounded-xl" +
                    " bg-linear-to-t from-white dark:from-black/50 to-white dark:to-black/50 hover:from-black/4" +
                    " dark:hover:from-black/70 duration-100 w-full flex items-center justify-between px-6 py-4"}>
                <div
                    className={"w-[30%]"}>
                    <p
                        className={"text-xs font-medium text-vibrant-purple-700 dark:text-vibrant-purple-500"}>
                        Project name
                    </p>
                    <h1
                        className={"truncatetext-black dark:text-white"}>
                        {props.title}
                    </h1>
                </div>
                <div
                    className={"w-[20%]"}>
                    <p
                        className={"text-xs font-medium text-black/50 dark:text-white/70"}>
                        Total time
                    </p>
                    <h1
                        className={"text-black dark:text-white"}>
                        {props.projectTotalTimeString}
                    </h1>
                </div>
                <div
                    className={"w-[20%]"}>
                    <p
                        className={"text-xs font-medium text-black/50 dark:text-white/70"}>
                        Users
                    </p>
                    <h1
                        className={"text-black dark:text-white"}>
                        {props.membersValue}
                    </h1>
                </div>
                <h1
                    className={"text-sm text-black dark:text-white/70"}>
                    {'Enter project >'}
                </h1>
            </div>
        </>
    )
}
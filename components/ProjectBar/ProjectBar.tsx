import React from "react";
import {useRouter} from "next/navigation";
import {useProjectSettings} from "@/features/hooks/useProjectSettings";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";

type ProjectBarProps = {
    userId: string | undefined;
    projectId: string;
    title: string;
    workspaceId: string
    projectTotalTimeString: string;
    membersValue: number
}

export const ProjectBar = ({...props}: ProjectBarProps) => {

    const project = useProjectSettings(props.workspaceId, props.projectId)
    const router = useRouter();

    const enterProject = async () => {
        if (!project || !props.userId) return
        const replaceToProject = () => router.push(`/projects/${project.type}/${project.projectId}`);

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
                className={"cursor-pointer ease-in border mb-4 border-black/20 shadow-md rounded-xl" +
                    " bg-linear-to-t from-black/2 to-white hover:from-black/4 duration-100 w-full flex items-center justify-between px-6 py-4"}
            >
                <div
                    className={"w-[30%]"}>
                    <p
                        className={"text-xs font-medium text-vibrant-purple-700"}
                    >
                        Project name
                    </p>
                    <h1
                        className={"truncate"}>
                        {props.title}
                    </h1>
                </div>
                <div
                    className={"w-[20%]"}>
                    <p
                        className={"text-xs font-medium text-black/50"}
                    >
                        Total time
                    </p>
                    <h1
                        className={""}>
                        {props.projectTotalTimeString}
                    </h1>
                </div>
                <div
                    className={"w-[20%]"}>
                    <p
                        className={"text-xs font-medium text-black/50"}
                    >
                        Users
                    </p>
                    <h1
                        className={""}>
                        {props.membersValue}
                    </h1>
                </div>
                <h1
                    className={"text-sm"}>
                    {'Enter project >'}
                </h1>
            </div>
        </>
    )
}
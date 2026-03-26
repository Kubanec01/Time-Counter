'use client'


import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {ProjectOption} from "@/types";
import {updateProjectOptions} from "@/features/utilities/create-&-update/updateProjectOption";
import {ChangeFormModal} from "@/app/workspaces/settings/components/ChangeFormModal";
import {useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {documentNotFound} from "@/messages/errors";
import {useProjectData} from "@/features/hooks/useProjectData";
import {MediumButton} from "@/components/MediumButton/MediumButton";


type ProjectOptionsProps = {
    projectOptions: ProjectOption[],
    projectId: string,
    workspaceId: string,
}

export const ProjectOptions = ({...props}: ProjectOptionsProps) => {


    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [optionName, setOptionName] = useState<string>("");
    const [errorMess, setErrorMess] = useState<string>("");
    const [isCreateLoading, setIsCreateLoading] = useState(false);

    // Hooks
    const {workspaceId} = useWorkSpaceContext()
    const projectData = useProjectData(workspaceId, props.projectId)
    const {replace} = useReplaceRouteLink()


    const createNewOption = async (option: ProjectOption) => {
        if (!projectData) return

        setIsCreateLoading(true);

        if (optionName.trim() === "") {
            setIsCreateLoading(false);
            return setErrorMess("Something went wrong, try again.")
        } else if (projectData.options.find(o => o.value === option.value)) {
            setIsCreateLoading(false);
            return setErrorMess("This option already exists.")
        }

        const docRef = doc(db, 'realms', workspaceId, 'projects', props.projectId)

        const updatedOptions = [...projectData.options, option]

        await updateDoc(docRef, {options: updatedOptions})

        setOptionName("")
        setErrorMess("")
        setIsCreateModalOpen(false)
        setIsCreateLoading(false)
    }

    const formBody = (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                createNewOption({
                    value: `${optionName.toLowerCase().replace(" ", "-")}`,
                    label: optionName,
                    active: true
                })
            }}
            className={"flex flex-col gap-3"}>
            <div
                className={"w-full mt-2"}
            >
                <label
                    htmlFor="custom-option"
                    className={"text-xs font-bold"}
                >
                    Custom option
                </label>
                <input
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                    className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                    id={"custom-option"}
                    placeholder={"Type your custom option"}
                    type="text"/>
            </div>
            <span
                className={"text-center text-xs text-red-600"}>
                    {errorMess}
            </span>
            <button
                disabled={isCreateLoading}
                type="submit"
                className={"medium-button bg-black-gradient mt-1"}>
                Create
            </button>
            <button
                type="button"
                onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}
                className={"text-[13px] font-bold text-black/50 mt-1 cursor-pointer hover:underline"}>
                {"Cancel"}
            </button>
        </form>
    )


    return (
        <div
            className={"border-b border-black/20 py-4"}>
            <div>
                <h1
                    className={"text-[22px]"}>
                    Project options
                </h1>
                <p
                    className={"text-xs text-black/50 w-[70%] mt-1"}>
                    You can choose which basic options you want to have active. To activate or deactivate an option,
                    simply click on it.
                    These are general project options. If you want to assign specific options to individual users, you
                    can do so in the <button
                    onClick={() => replace('/workspaces/users')}
                    className={"text-vibrant-purple-700 font-medium underline cursor-pointer"}>users</button> settings.
                </p>
            </div>
            <ul
                className={"flex flex-wrap items-center gap-5 w-[84%] mt-7"}>
                <li>
                    <MediumButton
                        onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}
                        className={"py-0.5 font-medium border-vibrant-purple-600 text-vibrant-purple-600 hover:bg-vibrant-purple-600 hover:text-white duration-150 rounded-full"}
                    >
                        {"Custom +"}
                    </MediumButton>
                </li>
                {props.projectOptions.map(o => (
                    <li
                        key={o.value}
                    >
                        <MediumButton
                            onClick={() => updateProjectOptions(props.workspaceId, props.projectId, projectData?.options, o)}
                            className={`${o.active ? "" : "border-black/20 text-black/20 hover:text-black hover:border-black duration-150"} py-0.5 font-medium border rounded-full`}
                        >
                            {o.label}
                        </MediumButton>
                    </li>
                ))}
            </ul>
            <section
                className={`${isCreateModalOpen ? "fixed left-2/4 top-2/4 -translate-2/4" : "hidden"}`}>
                <ChangeFormModal
                    title={"Add new option"}
                    confirmText={""}
                    formSection={formBody}
                    isFormSent={false}/>
            </section>
        </div>
    )
}
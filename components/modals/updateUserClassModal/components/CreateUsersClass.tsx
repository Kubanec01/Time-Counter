'use client'

import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ProjectOption} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {UsersClasses} from "@/data/users";

export const CreateUsersClass = ({isModalOpen, setIsCreatingClass}: {
    isModalOpen: boolean,
    setIsCreatingClass: Dispatch<SetStateAction<boolean>>
}) => {

    const [page, setPage] = useState<1 | 2>(1);
    const [customClassName, setCustomClassName] = useState("")
    const [customOptionName, setCustomOptionName] = useState("")
    const [customOptions, setCustomOptions] = useState<ProjectOption[]>([])

    const {workspaceId} = useWorkSpaceContext()

    const createCustomOptionForClass = () => {
        const value = customOptionName.trim().toLowerCase().replace(/\s+/g, '-')
        const optionExists = customOptions.find((option: ProjectOption) => option.value === value)
        if (optionExists) return

        const customOption: ProjectOption = {
            value: value,
            label: customOptionName
        }
        setCustomOptions(o => [...o, customOption])
        setCustomOptionName("")
    }

    const deleteCustomOptionForClass = (value: string) => {
        const filteredOptions = customOptions.filter(option => option.value !== value)
        setCustomOptions(filteredOptions)
    }

    const createCustomClass = async () => {
        const name = customClassName
        const id = customClassName.trim().toLowerCase().replace(/\s+/g, '-')

        const customClass: UsersClasses = {
            id: id,
            name: name,
            options: customOptions
        }

        const docRef = doc(db, "realms", workspaceId)
        await updateDoc(docRef, {userClasses: arrayUnion(customClass)})
        setIsCreatingClass(false)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!isModalOpen) setPage(1)
        setCustomClassName("")
        setCustomOptions([])
    }, [isModalOpen])
    return (
        <>
            {/* Create name */}
            <section
                className={`${page === 1 ? "translate-x-0 duration-400 ease-in" : "-translate-x-[100%] duration-400 ease-in"}
            flex justify-center items-center px-2`}>
                <div
                    className={"flex justify-center gap-2"}>
                    <input type="text"
                           value={customClassName}
                           onChange={(e) => setCustomClassName(e.target.value)}
                           placeholder={"Write name of your class"}
                           className={"border px-2 rounded-sm py-1"}/>
                    <button
                        disabled={customClassName.trim().length === 0}
                        onClick={() => setPage(2)}
                        className={"border px-2 rounded-sm cursor-pointer"}>
                        Confirm
                    </button>
                </div>
            </section>
            {/* Create Options */}
            <section
                className={`${page === 1 ? "translate-x-[100%] duration-400 ease-in" : "translate-x-0 duration-400 ease-in"}
            flex flex-col justify-center items-center px-2`}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        createCustomOptionForClass()
                    }}
                    className={"flex justify-center gap-2"}>
                    <input type="text"
                           value={customOptionName}
                           onChange={(e) => setCustomOptionName(e.target.value)}
                           placeholder={"Write name of your class"}
                           className={"border px-2 rounded-sm py-1"}/>
                    <button
                        type="submit"
                        className={"border px-2 rounded-sm cursor-pointer"}>
                        Confirm
                    </button>
                </form>
                <ul
                    className={"flex justify-center gap-2 mx-auto mt-4 w-[90%] flex-wrap"}>
                    {customOptions.map((item, index) => (
                        <li
                            key={`${item.value}-${index}`}
                            className={"flex gap-2 items-center justify-center px-2 py-0.5 rounded-full border"}>
                            {item.label}
                            <button
                                type="button"
                                onClick={() => deleteCustomOptionForClass(item.value)}
                                className={"cursor-pointer"}
                            >X
                            </button>
                        </li>
                    ))}
                </ul>
                <div
                    className={"flex justify-center items-center gap-8 mt-6 cursor-pointer"}>
                    <button
                        onClick={() => setPage(1)}
                    >Back
                    </button>
                    <button
                        onClick={() => createCustomClass()}
                        disabled={customOptions.length === 0}
                        className={"cursor-pointer"}
                    >Create class
                    </button>
                </div>
            </section>
        </>
    )
}
"use client"

import {usersClasses} from "@/data/users";
import {Dispatch, SetStateAction} from "react";


interface UpdateUserClassModalProps {
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    formFunction: () => void
}

export const UpdateUserClassModal = ({...props}: UpdateUserClassModalProps) => {

    const openStyle = props.isModalOpen ? "flex" : "hidden";

    return (
        <>
            <section
                className={`${openStyle} fixed top-0 left-0 w-full h-screen z-50 bg-red justify-center items-center`}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        props.formFunction()
                    }}
                    className={"w-[300px] h-[300px] border bg-white rounded-md"}
                >
                    <h1
                        className={"flex justify-center py-4"}>
                        Set User Class
                    </h1>
                    <ul
                        className={"w-full flex flex-col gap-2"}
                    >
                        {usersClasses.map((uClass) => (
                            <li
                                key={uClass.id}>
                                <button
                                    type="submit"
                                    className={`p-1 w-full border-b cursor-pointer text-start`}
                                >
                                    {uClass.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => props.setIsModalOpen(false)}
                        type={"button"}
                        className={"w-full mt-2 cursor-pointer"}
                    >
                        Cancel
                    </button>
                </form>
            </section>
        </>
    )
}
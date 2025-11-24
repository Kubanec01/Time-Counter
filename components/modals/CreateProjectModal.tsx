'use client'

import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {PiCirclesThreeFill} from "react-icons/pi";


interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    setInputValue: Dispatch<SetStateAction<string>>;
    inputValue: string;
    title: string;
    formFunction: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CreateProjectModal = ({...props}: ModalProps) => {
    // States

    const modalRef = useRef<HTMLInputElement>(null);

    //   Style
    const openStyle = props.isModalOpen ? "flex" : "hidden";

    //   CloseModal Function
    const closeModal = () => props.setIsModalOpen((v) => !v);

    useEffect(() => {

        modalRef.current?.focus();
    }, [props.isModalOpen]);

    return (
        <section
            className={`${openStyle} absolute top-0 left-0 w-full h-screen z-50 backdrop-blur-sm justify-center items-center`}
        >
            <form
                onSubmit={props.formFunction}
                className={"w-[90%] max-w-[298px] rounded-xl border border-custom-gray-600 bg-white p-7"}
            >
                <span
                    className={"mx-auto text-4xl w-full flex justify-center text-pastel-purple-700"}
                >
                    <PiCirclesThreeFill/>
                </span>
                <div className={"mt-[18px]"}>
                    <h1 className={"text-lg font-medium"}>Create new project?</h1>
                    <p className={"text-sm text-custom-gray-800 w-[98%]"}>
                        Create a new project where you can measure
                        progress, time, performance, and simply everything
                        that will move your work to the speed of light! (max 22 characters)</p>
                </div>
                <input type="text"
                       ref={modalRef}
                       onChange={(v) => props.setInputValue(v.target.value)}
                       value={props.inputValue}
                       placeholder={"What are you going to work on?"}
                       className={"w-full h-[34px] text-custom-gray-800 pl-2" +
                           " border-pastel-purple-700 border-2 text-sm rounded-[100px] mt-[24px] outline-none"}/>
                <div
                    className={"w-full flex items-center justify-between mt-[26px]"}>
                    <button
                        onClick={() => closeModal()}
                        type={"button"}
                        className={"cursor-pointer w-[100px] h-[34px] text-base rounded-[100px] text-custom-gray-800 border border-custom-gray-800"}>
                        Cancel
                    </button>
                    <button
                        type={"submit"}
                        className={"cursor-pointer w-[100px] h-[34px] text-base rounded-[100px] text-white bg-pastel-purple-700"}>
                        Create
                    </button>
                </div>
            </form>
        </section>
    )
        ;
};

export default CreateProjectModal;

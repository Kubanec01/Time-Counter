'use client'

import React, {Dispatch, ReactNode, SetStateAction, useEffect, useRef} from "react";


interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    setInputValue: Dispatch<SetStateAction<string>>;
    inputValue: string;
    title: string;
    desc: string;
    icon: ReactNode;
    inputPlaceholder: string;
    formFunction: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RenameModal = ({...props}: ModalProps) => {

    const modalRef = useRef<HTMLInputElement>(null);

    //   Styles
    const openStyle = props.isModalOpen ? "flex" : "hidden";

    //   CloseModal Function
    const closeModal = () => props.setIsModalOpen((v) => !v);

    useEffect(() => {
        modalRef.current?.focus();
    }, [props.isModalOpen]);


    return (
        <section
            className={`${openStyle} fixed top-0 left-0 w-full h-screen z-50 backdrop-blur-xs justify-center items-center`}
        >
            <form
                onSubmit={props.formFunction}
                className={"w-[90%] max-w-[298px] rounded-xl border border-custom-gray-600 bg-white/84 p-7"}
            >
                <span
                    className={"mx-auto text-4xl w-full flex justify-center text-blue-500"}
                >
                    {props.icon}
                </span>
                <div className={"mt-[18px]"}>
                    <h1 className={"text-lg font-semibold"}>{props.title}</h1>
                    <p className={"text-sm text-black/60 font-semibold w-[98%]"}>{props.desc}</p>
                </div>
                <input type="text"
                       ref={modalRef}
                       onChange={(v) => props.setInputValue(v.target.value)}
                       value={props.inputValue}
                       maxLength={24}
                       placeholder={`${props.inputPlaceholder}`}
                       className={"w-full h-[34px] text-black pl-2" +
                           " border text-sm rounded-[100px] mt-[18px] outline-none"}/>
                <div
                    className={"w-full flex items-center justify-between mt-[14px]"}>
                    <button
                        onClick={() => closeModal()}
                        type={"button"}
                        className={"cursor-pointer w-[100px] h-[34px] text-base rounded-[100px] text-custom-gray-800 border" +
                            " border-custom-gray-800 hover:bg-black/5 duration-100 ease-in"}>
                        Cancel
                    </button>
                    <button
                        type={"submit"}
                        className={"cursor-pointer w-[100px] h-[34px] rounded-[100px] text-white bg-blue-500 hover:bg-blue-600" +
                            " duration-100 ease-in"}>
                        Create
                    </button>
                </div>
            </form>
        </section>
    )
        ;
};

export default RenameModal;

'use client'

import {Dispatch, ReactNode, SetStateAction, useEffect, useRef} from "react";
import {PiCirclesThreeFill} from "react-icons/pi";


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
            className={`${openStyle} fixed top-0 left-0 w-full h-screen z-50 backdrop-blur-xs justify-center items-center`}
        >
            <form
                onSubmit={props.formFunction}
                className={"w-[90%] max-w-[298px] rounded-xl border border-custom-gray-600 bg-white p-7"}
            >
                <span
                    className={"mx-auto text-4xl w-full flex justify-center text-pastel-purple-700"}
                >
                    {props.icon}
                </span>
                <div className={"mt-[18px]"}>
                    <h1 className={"text-lg font-medium"}>{props.title}</h1>
                    <p className={"text-sm text-custom-gray-800 w-[98%]"}>{props.desc}</p>
                </div>
                <input type="text"
                       ref={modalRef}
                       onChange={(v) => props.setInputValue(v.target.value)}
                       value={props.inputValue}
                       maxLength={24}
                       placeholder={`${props.inputPlaceholder}`}
                       className={"w-full h-[34px] text-custom-gray-800 pl-2" +
                           " border-pastel-purple-700 border-2 text-sm rounded-[100px] mt-[18px] outline-none"}/>
                <div
                    className={"w-full flex items-center justify-between mt-[14px]"}>
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

export default RenameModal;

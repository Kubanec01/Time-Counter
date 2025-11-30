import React, {Dispatch, ReactNode, SetStateAction} from "react";
import {PiSealWarningFill} from "react-icons/pi";

interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    title: string;
    btnFunction: () => void | Promise<void>;
    desc: string
    deleteBtnText: string
}

const DeleteModal = ({...props}: ModalProps) => {
    //   Style
    const openStyle = props.isModalOpen ? "flex" : "hidden";

    return (
        <section
            className={`${openStyle} fixed top-0 left-0 w-full h-screen z-50 backdrop-blur-sm justify-center items-center`}
        >
            <div
                className={"max-w-[298px] w-[90%] py-[28px] px-[30px] rounded-[12px] bg-white border border-custom-gray-600"}>
                <span className={"mx-auto flex justify-center text-4xl"}>
                    <PiSealWarningFill/>
                </span>
                <div className={"mt-[22px] w-full"}>
                    <h1 className={"text-lg font-medium"}>{props.title}</h1>
                    <p className={"text-sm w-[94%] text-custom-gray-800"}>{props.desc}</p>
                </div>
                <div
                    className={"mt-[26px] w-full flex flex-col justify-center gap-[10px]"}>
                    <button
                        onClick={props.btnFunction}
                        className={"cursor-pointer w-full rounded-[100px] py-2 bg-black text-white text-sm"}>{props.deleteBtnText}</button>
                    <button
                        onClick={() => props.setIsModalOpen(false)}
                        className={"cursor-pointer w-full rounded-[100px] py-1.5 border-2 text-black text-sm"}>Cancel
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DeleteModal;

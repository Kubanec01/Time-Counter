import React, {Dispatch, SetStateAction} from "react";
import {PiSealWarningFill} from "react-icons/pi";

interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    title: string;
    btnFunction: () => void | Promise<void>;
    desc: string
    deleteBtnText: string
    topDistance: string
}

const DeleteModal = ({...props}: ModalProps) => {
    //   Style
    const openStyle = props.isModalOpen ? "block" : "hidden";

    return (
        <div
            style={{top: props.topDistance}}
            className={`${openStyle} fixed left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[298px] w-[90%] py-[28px] px-[30px] rounded-[12px] bg-white/70 backdrop-blur-sm border border-black/10`}>
                <span className={"mx-auto flex justify-center text-4xl"}>
                    <PiSealWarningFill/>
                </span>
            <div className={"mt-[22px] w-full"}>
                <h1 className={"text-lg font-semibold"}>{props.title}</h1>
                <p className={"text-sm w-[94%] text-black/60 font-semibold"}>{props.desc}</p>
            </div>
            <div
                className={"mt-[26px] w-full flex flex-col justify-center gap-[10px]"}>
                <button
                    onClick={props.btnFunction}
                    className={"cursor-pointer w-full rounded-[100px] py-2 bg-black hover:bg-red-800/80 text-white text-sm"}>{props.deleteBtnText}</button>
                <button
                    onClick={() => props.setIsModalOpen(false)}
                    className={"cursor-pointer w-full rounded-[100px] py-1.5 border-2 text-black hover:bg-gray-700/5 text-sm"}>Cancel
                </button>
            </div>
        </div>
    );
};

export default DeleteModal;

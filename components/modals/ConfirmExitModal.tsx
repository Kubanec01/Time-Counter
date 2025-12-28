import React, {Dispatch, SetStateAction} from "react";
import {FaUser} from "react-icons/fa";

interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    title: string;
    btnFunction: () => void | Promise<void>;
    desc: string
    btnText: string
}

const ConfirmExitModal = ({...props}: ModalProps) => {
    //   Style
    const openStyle = props.isModalOpen ? "block" : "hidden";

    return (
        <div
            className={`${openStyle} fixed top-[300%] left-[50%] -translate-x-[50%] max-w-[298px] w-[90%] py-[28px] px-[30px]
             rounded-[12px] bg-white/98 backdrop-blur-xl border border-black/10`}>
                <span className={"mx-auto flex justify-center text-4xl"}>
                    <FaUser/>
                </span>
            <div className={"mt-[22px] pl-4 w-full"}>
                <h1 className={"text-lg font-medium"}>{props.title}</h1>
                <p className={"text-sm w-[96%] text-custom-gray-800"}>{props.desc}</p>
            </div>
            <div
                className={"mt-[26px] w-full flex flex-col justify-center gap-[10px]"}>
                <button
                    onClick={props.btnFunction}
                    className={"cursor-pointer w-full rounded-[100px] py-2 bg-black hover:bg-gray-900/90 text-white text-sm"}>{props.btnText}</button>
                <button
                    onClick={() => props.setIsModalOpen(false)}
                    className={"cursor-pointer w-full rounded-[100px] py-1.5 border-2 text-black hover:bg-gray-700/5 text-sm"}>Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmExitModal;

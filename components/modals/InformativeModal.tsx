import React, {Dispatch, SetStateAction} from "react";


interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    title: string;
}


const InformativeModal = ({...props}: ModalProps) => {

    const openStyle = props.isModalOpen ? "flex" : "hidden";


    return (
        <section
            className={`${openStyle} fixed top-0 left-0 w-full h-screen z-50 justify-center items-start`}
        >
            <div
                className="max-w-[298px] w-[90%] py-[28px] px-[30px] rounded-lg bg-white/70 backdrop-blur-sm border border-black/10">
                <h1 className="text-start w-[80%] text-base">
                    {props.title}
                </h1>
                <button
                    onClick={() => props.setIsModalOpen(false)}
                    className="text-sm mt-[12px] py-1.5 w-full rounded-[100px] cursor-pointer text-white bg-black/60 hover:bg-black/70
                    "
                >
                    Cancel
                </button>
            </div>
        </section>
    )
}

export default InformativeModal;
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
                className="border border-custom-gray-600 rounded-[12px] bg-[white] py-4 px-[20px] mt-[100px]">
                <h1 className="text-start w-[80%] text-base">
                    {props.title}
                </h1>
                <button
                    onClick={() => props.setIsModalOpen(false)}
                    className="text-sm mt-[12px] py-2 w-full rounded-[100px] cursor-pointer text-white bg-black
                    "
                >
                    Cancel
                </button>
            </div>
        </section>
    )
}

export default InformativeModal;
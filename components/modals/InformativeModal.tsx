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
            className={`${openStyle} absolute top-0 left-0 w-full h-screen z-50 backdrop-blur-sm justify-center items-center`}
        >
            <div
                className="border-2 border-[#bababa] w-[500px] h-[260px] rounded-3xl bg-[white] px-6 py-8 -mt-[100px] flex flex-col justify-between">
                <h1 className="mx-auto w-[80%] text-2xl text-center">
                    {props.title}
                </h1>
                <div className="flex justify-center px-8 mb-2">
                    <button
                        onClick={() => props.setIsModalOpen(false)}
                        className="text-xl px-8 py-1 rounded-xl cursor-pointer text-blue-600 border-2 border-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </section>
    )
}

export default InformativeModal;
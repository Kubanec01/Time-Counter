import React, {Dispatch, SetStateAction} from "react";

interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    title: string;
    btnFunction: () => void;
}

const DeleteModal = ({...props}: ModalProps) => {
    //   Style
    const openStyle = props.isModalOpen ? "flex" : "hidden";

    return (
        <section
            className={`${openStyle} absolute top-0 left-0 w-full h-screen z-50 backdrop-blur-sm justify-center items-center`}
        >
            <div
                className="border-2 border-[#bababa] w-[500px] h-[280px] rounded-3xl bg-[white] px-6 py-8 -mt-[100px] flex flex-col justify-between">
                <h1 className="mx-auto w-[80%] text-lg">
                    Are you sure you want to delete the {props.title} section? <br/>
                    Once you delete it, it won't be possible to restore it.
                </h1>
                <div className="flex justify-between px-8 mb-2">
                    <button
                        onClick={() => props.setIsModalOpen(false)}
                        className="text-xl px-8 py-1 rounded-xl cursor-pointer text-blue-600 border-2 border-blue-600"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={props.btnFunction}
                        className="text-xl px-8 py-1 rounded-xl cursor-pointer border-red-600 bg-red-600 text-white border-2"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DeleteModal;

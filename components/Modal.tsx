import {Dispatch, SetStateAction} from "react";

interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    setInputValue: Dispatch<SetStateAction<string>>;
    inputValue: string;
    title: string;
    formFunction: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Modal = ({...props}: ModalProps) => {
    //   Style
    const openStyle = props.isModalOpen ? "flex" : "hidden";

    //   CloseModal Function
    const closeModal = () => props.setIsModalOpen((v) => !v);

    return (
        <section
            className={`${openStyle} absolute top-0 left-0 w-full h-screen z-50 backdrop-blur-sm justify-center items-center`}
        >
            <div className="border-2 border-[#bababa] w-[500px] h-[280px] rounded-3xl bg-[white] px-6 py-8 -mt-[100px]">
                <form
                    onSubmit={props.formFunction}
                    className="w-[374px] h-full mx-auto flex flex-col justify-between items-center text-3xl"
                >
                    <h1>{props.title.toUpperCase()}</h1>
                    <input
                        onChange={(v) => props.setInputValue(v.target.value)}
                        value={props.inputValue}
                        type="text"
                        placeholder="Project Name..."
                        className="border w-full rounded-xl text-xl py-2 px-2 focus:outline-blue-300 text-[#403f3f]"
                    />
                    <div className="w-full flex justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                closeModal();
                                props.setInputValue("");
                            }}
                            className="text-xl px-8 py-1 rounded-xl cursor-pointer border-red-600 text-red-600 border-2"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => {
                                props.setIsModalOpen(false);
                            }}
                            type="submit"
                            className="text-xl px-8 py-1 rounded-xl cursor-pointer bg-blue-600 text-white border-2 border-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Modal;

'use client'


import {PiCirclesThreeFill} from "react-icons/pi";
import {LoggingTypeButton} from "@/app/projects/logging/[id]/components/createLoggingModal/LoggingTypeButton";
import {Dispatch, FormEvent, SetStateAction, useState} from "react";
import {LoggingType} from "@/types";

interface LoggingModalProps {
    title: string;
    desc: string;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    setLoggingType: Dispatch<SetStateAction<LoggingType>>;
    inputValue: string;
    setInputValue: Dispatch<SetStateAction<string>>;
    timeInputValue: string;
    setTimeInputValue: Dispatch<SetStateAction<string>>;
    formFunction: (e: FormEvent<HTMLFormElement>) => void;
}

const CreateLoggingModal = ({...props}: LoggingModalProps) => {

    // States
    const [loggingType, setLoggingType] = useState<LoggingType>("Work");

    const setVisibility = props.isModalOpen ? "block" : "hidden";
    const setCustomInputVisibility = loggingType === "Custom" ? "block" : "hidden";

    const closeModal = () => {
        props.setIsModalOpen(false)
        props.setInputValue("")
        props.setLoggingType(null)
        props.setTimeInputValue("0.25")
        setLoggingType(null)
    }

    const areLogInputsInvalid = () => {
        return (loggingType === null || props.inputValue.trim() === "" || props.timeInputValue.trim() === "");
    }

    return (
        <section
            className={`${setVisibility} fixed top-0 left-0 w-full h-screen z-50 backdrop-blur-sm flex justify-center items-center`}>
            <div
                className={`w-[330px] bg-custom-dark-gray-800 p-7 rounded-xl`}
            >
            <span
                className={"text-white text-4xl flex justify-center"}>
                    <PiCirclesThreeFill/>
            </span>
                <div
                    className={"mt-4 w-[84%] mx-auto"}>
                    <h1
                        className={"text-lg font-medium text-white"}>
                        {props.title}
                    </h1>
                    <p
                        className={"text-custom-gray-700 text-sm font-medium"}>
                        {props.desc}
                    </p>
                </div>
                <section>
                    <div
                        className={"flex justify-center gap-2 mt-6"}>
                        <LoggingTypeButton
                            onClick={() => {
                                setLoggingType("Work");
                                props.setLoggingType("Work");
                            }}
                            loggingType={loggingType}
                            activeTagColor={"activeBlue"}
                            tagColor={"blue"}
                            text={"Work"}/>
                        <LoggingTypeButton
                            onClick={() => {
                                setLoggingType("Research")
                                props.setLoggingType("Research")
                            }}
                            loggingType={loggingType}
                            activeTagColor={"activeGray"}
                            tagColor={"gray"}
                            text={"Research"}/>
                        <LoggingTypeButton
                            onClick={() => {
                                setLoggingType("Study")
                                props.setLoggingType("Study")
                            }}
                            loggingType={loggingType}
                            activeTagColor={"activePink"}
                            tagColor={"pink"}
                            text={"Study"}/>
                    </div>
                    <div
                        className={"flex justify-center gap-2 mt-1.5"}>
                        <LoggingTypeButton
                            onClick={() => {
                                setLoggingType("Coding")
                                props.setLoggingType("Coding")
                            }}
                            loggingType={loggingType}
                            activeTagColor={"activeGreen"}
                            tagColor={"green"}
                            text={"Coding"}/>
                        <LoggingTypeButton
                            onClick={() => {
                                setLoggingType("Deep Work")
                                props.setLoggingType("Deep Work")
                            }}
                            loggingType={loggingType}
                            activeTagColor={"activePurple"}
                            tagColor={"purple"}
                            text={"Deep Work"}/>
                        <LoggingTypeButton
                            onClick={() => {
                                setLoggingType("Custom")
                                props.setLoggingType("Custom")
                            }}
                            loggingType={loggingType}
                            activeTagColor={"activeWhite"}
                            tagColor={"white"}
                            text={"Custom"}/>
                    </div>
                </section>
                <form
                    onSubmit={props.formFunction}
                    className={"mx-auto w-[90%] mt-1.5"}>
                    <input
                        onChange={(e) => props.setLoggingType(e.target.value)}
                        placeholder={"Write your custom category..."}
                        className={`${setCustomInputVisibility} w-full h-[32px] text-white pl-2 border-white border text-sm rounded-[100px] outline-none mb-2`}/>
                    <input
                        value={props.inputValue}
                        onChange={(e) => props.setInputValue(e.target.value)}
                        placeholder={"What are you going to work on?"}
                        className={"w-full h-[32px] text-pastel-pink-700 pl-2" +
                            " border-pastel-pink-700 border text-sm rounded-[100px] outline-none"}/>
                    <input
                        min={0.25}
                        max={900}
                        step={0.25}
                        value={props.timeInputValue}
                        onChange={(e) => props.setTimeInputValue(e.target.value)}
                        type={"number"}
                        placeholder={"0.25"}
                        className={"h-[34px] w-full text-white px-3 border-white mt-4 border rounded-[100px] outline-none"}/>
                    <button
                        type="submit"
                        disabled={areLogInputsInvalid()}
                        style={{
                            cursor: areLogInputsInvalid() ? "default" : "pointer",
                            background: areLogInputsInvalid() ? "#6E6E6E" : ""
                        }}
                        className={"w-full py-1 rounded-[100px] bg-pastel-pink-700 text-black font-medium mt-3"}>
                        Create
                    </button>
                    <button
                        type="button"
                        onClick={closeModal}
                        className={"w-full py-1 cursor-pointer rounded-[100px] border-2 border-pastel-pink-700 text-pastel-pink-700 font-medium mt-1.5"}>
                        Cancel
                    </button>
                </form>
            </div>
        </section>
    )
}

export default CreateLoggingModal

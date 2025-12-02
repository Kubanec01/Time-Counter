'use client'


import {PiCirclesThreeFill} from "react-icons/pi";
import {LoggingTypeButton} from "@/app/projects/logging/[id]/components/createLoggingModal/LoggingTypeButton";

interface LoggingModalProps {
    title: string;
    desc: string;
}

const CreateLoggingModal = ({...props}: LoggingModalProps) => {


    return (
        <div
            className={"fixed top-[50%] -translate-[50%] left-[50%] w-[330px] bg-custom-dark-gray-800 p-7 rounded-xl"}
        >
            <span
                className={"text-white text-4xl flex justify-center"}>
                    <PiCirclesThreeFill/>
            </span>
            <div
                className={"mt-4 w-[80%] mx-auto"}>
                <h1
                    className={"text-lg font-medium text-white"}>
                    {props.title}
                </h1>
                <p
                    className={"text-custom-gray-700 text-sm w-[90%] font-medium"}>
                    {props.desc}
                </p>
            </div>
            <section>
                <div
                    className={"flex justify-center gap-2 mt-6"}>
                    <LoggingTypeButton text={"Work"} tagColor={"blue"}/>
                    <LoggingTypeButton text={"Research"} tagColor={"gray"}/>
                    <LoggingTypeButton text={"Study"} tagColor={"pink"}/>
                </div>
                <div
                    className={"flex justify-center gap-2 mt-1.5"}>
                    <LoggingTypeButton text={"Coding"} tagColor={"green"}/>
                    <LoggingTypeButton text={"Deep Work"} tagColor={"purple"}/>
                    <LoggingTypeButton text={"Custom >"} tagColor={"white"}/>
                </div>
                {/*<input type="text"/>*/}
            </section>
            <form
                className={"mx-auto w-[90%] mt-1.5"}>
                <input
                    type="text" name="" id=""
                    placeholder={"What are you going to work on?"}
                    className={"w-full h-[32px] text-pastel-pink-700 pl-2" +
                        " border-pastel-pink-700 border text-sm rounded-[100px] outline-none"}/>
                <button
                    className={"w-full py-1 rounded-[100px] bg-pastel-pink-700 text-black font-medium mt-3"}>
                    Create
                </button>
                <button
                    className={"w-full py-1 rounded-[100px] border-2 border-pastel-pink-700 text-pastel-pink-700 font-medium mt-1.5"}>
                    Create
                </button>
            </form>
        </div>

    )
}

export default CreateLoggingModal
import React from "react";

interface SubSectionCartProps {
    index: number;
    startTime: string
    stopTime: string
    clockDifference: string
    date: string
    deleteFunction: () => Promise<void>
}

const SubSectionCart = (props: SubSectionCartProps) => {

    return (
        <li
            key={props.index}
            className="border w-[150px] h-[100px] rounded-xl shrink-0 flex flex-col justify-between items-start p-2"
        >
                        <span className="font-semibold">
                        h: {props.startTime} - {props.stopTime}
                        </span>
            <span className="font-semibold">t: {props.clockDifference}</span>
            <span className="font-semibold">d: {props.date}</span>
            <button
                onClick={props.deleteFunction}
                className={"text-red-500 cursor-pointer"}
            >
                Delete
            </button>
        </li>
    )
}

export default SubSectionCart;
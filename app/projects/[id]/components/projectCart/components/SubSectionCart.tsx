import React from "react";
import {FiTrash2} from "react-icons/fi";

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
            className="w-[128px] h-[80px] rounded-xl font-medium text-sm flex flex-col justify-between items-start
             p-[8px] bg-pastel-purple-500 relative">
            <span className="">
                h: {props.startTime} - {props.stopTime}
            </span>
            <span className="">t: {props.clockDifference}</span>
            <span className="">d: {props.date}</span>
            <button
                onClick={() => props.deleteFunction()}
                className={"absolute bottom-[12px] right-[8px] text-sm cursor-pointer"}><FiTrash2/></button>
        </li>
    )
}

export default SubSectionCart;
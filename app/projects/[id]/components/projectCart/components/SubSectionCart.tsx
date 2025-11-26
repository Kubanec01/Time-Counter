import React from "react";
import {FiClock, FiTrash2} from "react-icons/fi";
import {BsStopwatch} from "react-icons/bs";
import {TfiTime, TfiTimer} from "react-icons/tfi";
import {FaCalendarDay, FaClock, FaStopwatch} from "react-icons/fa";

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
            className="w-[130px] h-[80px] rounded-xl font-medium text-sm flex flex-col justify-between items-start
             p-[8px] bg-pastel-purple-500 relative">
            <span className="flex items-center justify-center gap-1">
                <FaClock className={"text-xs ml-[1.5px]"}/> {props.startTime} - {props.stopTime}
            </span>
            <span className="flex items-center justify-center gap-1">
                <FaStopwatch/> {props.clockDifference}
            </span>
            <span className="flex items-center justify-center gap-1">
                <FaCalendarDay className={"text-[13px]"}/> {props.date}
            </span>
            <button
                onClick={() => props.deleteFunction()}
                className={"absolute bottom-[12px] right-[8px] text-sm cursor-pointer"}><FiTrash2/></button>
        </li>
    )
}

export default SubSectionCart;
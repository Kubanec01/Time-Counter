import React from "react";
import {FiTrash2} from "react-icons/fi";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";

interface SubSectionCartProps {
    startTime: string;
    stopTime: string;
    durationTime: number;
    date: string;
    deleteFunction: () => Promise<void>
}

const SubSectionCart = (props: SubSectionCartProps) => {

    const labelStyle = "text-xs text-black/60"
    const textStyle = "text-sm text-black/70"


    return (
        <li
            className="w-full shrink-0 flex py-1.5 border-t border-black/14 bg-linear-to-b to-white from-black/2 from-5% justify-between items-center">
            <div className="w-1/4">
                <h1
                    className={labelStyle}>
                    Time Range
                </h1>
                <p
                    className={textStyle}>
                    {props.startTime} - {props.stopTime}
                </p>
            </div>
            <div className="w-1/4">
                <h1
                    className={labelStyle}>
                    Duration
                </h1>
                <p
                    className={textStyle}>
                    {formatSecondsToTimeString(props.durationTime)}
                </p>
            </div>
            <div className="w-1/4">
                <h1
                    className={labelStyle}>
                    Date
                </h1>
                <p
                    className={textStyle}>
                    {props.date}
                </p>
            </div>
            <div
                className={"w-1/4 flex items-center justify-end pr-7"}>
                <button
                    onClick={() => props.deleteFunction()}
                    className={"text-sm text-black/30 hover:text-red-300 cursor-pointer"}>
                    <FiTrash2/>
                </button>
            </div>
        </li>
    )
}

export default SubSectionCart;
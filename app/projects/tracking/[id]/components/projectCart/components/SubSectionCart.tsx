import React from "react";
import {FiTrash2} from "react-icons/fi";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";

interface SubSectionCartProps {
    index: number;
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
            key={props.index}
            className="w-full shrink-0 flex p-2 border-b border-black/14 bg-linear-to-b from-white from-60% to-black/3 justify-between items-center">
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
                className={"w-1/4 flex items-center justify-end pr-8"}>
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
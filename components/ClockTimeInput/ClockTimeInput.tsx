import React from "react";
import {twMerge} from "tailwind-merge";


type ClockTimeInputProps = {
    inputId: string;
    value: string;
    onChange: (value: string) => void;
    labelClassName?: string;
    labelText?: string;
    inputClassName?: string;

}

export const ClockTimeInput = ({...props}: ClockTimeInputProps) => {


    const labelClass = "font-medium text-sm text-black/60"
    const inputClass = "border border-black/20 text-sm focus:outline-vibrant-purple-600 p-1.5 px-2 rounded-md bg-white"

    return (
        <div
            className={"flex flex-col"}>
            <label
                htmlFor={props.inputId}
                className={twMerge(labelClass, props.labelClassName)}>
                {props.labelText}
            </label>
            <input
                id="time"
                type={"time"}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                className={twMerge(inputClass, props.inputClassName)}/>
        </div>
    )

}
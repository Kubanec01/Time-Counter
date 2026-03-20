import React from "react";
import {twMerge} from "tailwind-merge";

type NumberInputProps = {
    inputId: string;
    value: string;
    onChange: (value: number) => void;
    labelChildren?: string;
    labelClassname?: string;
    inputClassname?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
}

export const NumberInput = ({...props}: NumberInputProps) => {

    const labelClass = "font-medium text-sm text-black/60"
    const inputClass = "border border-black/20 text-sm focus:outline-vibrant-purple-600 p-1.5 px-2 rounded-md bg-white"

    return (
        <div
            className={`flex flex-col`}>
            <label
                htmlFor="time"
                className={twMerge(labelClass, props.labelClassname)}>
                {props.labelChildren}
            </label>
            <input
                id="time"
                min={props.min}
                max={props.max}
                step={props.step}
                value={props.value}
                onChange={(e) => props.onChange(Number(e.target.value))}
                type={"number"}
                placeholder={props.placeholder}
                className={twMerge(inputClass, props.inputClassname)}/>
        </div>
    )

}
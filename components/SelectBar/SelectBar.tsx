import React, {JSX} from "react";
import {twMerge} from "tailwind-merge";
import {BaseOption} from "@/types";

type SelectBarProps<T> = {
    options: BaseOption[]
    value: T,
    onChange: (value: T) => void,
    inputClassname?: string,
    labelClassname?: string,
    labelText?: JSX.Element | string
    inputId: string,
}

export const SelectBar = <T extends string>({...props}: SelectBarProps<T>) => {

    const labelClass = "font-medium text-sm text-black/60"
    const inputClass = "medium-button bg-gradient-to-b from-white from-30% to-black/8 border border-black/15 text-black outline-none"


    return (
        <div
            className={"flex flex-col"}>
            <label
                htmlFor={props.inputId}
                className={twMerge(labelClass, props.labelClassname)}
            >
                {props.labelText}
            </label>
            <select
                id={props.inputId}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value as T)}
                className={twMerge(inputClass, props.inputClassname)}
            >
                {props.options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )

}

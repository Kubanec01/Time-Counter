import React, {JSX} from "react";
import {twMerge} from "tailwind-merge";
import {BaseOption} from "@/types";

type SelectBarProps<T> = {
    options: BaseOption[]
    value: T,
    onChange: (value: T) => void,
    inputClassname?: string,
    labelClassname?: string,
    labelChildren: JSX.Element | string
    inputId: string,
}

export const MediumSelectBar = <T extends string>({...props}: SelectBarProps<T>) => {


    return (
        <div
            className={"flex flex-col"}>
            <label htmlFor={props.inputId}
                   className={`font-medium text-sm text-black/60 ${props.labelClassname}`}>
                {props.labelChildren}
            </label>
            <select
                id={props.inputId}
                onChange={(e) => props.onChange(e.target.value as T)}
                className={twMerge(
                    "medium-button bg-gradient-to-b from-white from-30% to-black/8 border border-black/15 text-black outline-none",
                    props.inputClassname
                )}
            >
                {props.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )

}

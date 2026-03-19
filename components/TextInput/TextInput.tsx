import {IoSearch} from "react-icons/io5";
import React from "react";
import {twMerge} from "tailwind-merge";

type SearchInputProps<T> = {
    inputId: string;
    placeholder: string;
    value: T;
    OnChange: (event: T) => void;
    isIconVisible: boolean;
    labelClassname?: string;
    labelText?: string;
    inputClassname?: string;
}

export const TextInput = <T extends string>({...props}: SearchInputProps<T>) => {

    const labelClass = "font-medium text-sm text-black/60"
    const inputClass = "relative rounded-md w-full p-1 pl-2 pr-8.5 bg-white/90 border border-black/20 text-sm outline-none"

    return (
        <div className={`relative flex flex-col`}>
            <label htmlFor={props.inputId}
                   className={twMerge(labelClass, props.labelClassname)}>
                {props.labelText}
            </label>
            <input
                id={props.inputId}
                value={props.value}
                onChange={(e) => props.OnChange(e.target.value as T)}
                className={twMerge(inputClass, props.inputClassname)
                }
                placeholder={props.placeholder}
                type="text"/>
            <IoSearch
                style={{display: props.isIconVisible ? "block" : "none"}}
                className={"absolute top-1/2 -translate-y-1/2 right-3 text-lg text-black/40"}/>
        </div>
    )

}
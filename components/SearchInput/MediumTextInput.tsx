import {IoSearch} from "react-icons/io5";
import React from "react";

type SearchInputProps<T> = {
    placeholder: string;
    OnChange: (event: T) => void;
    className?: string;
    wrapperClassname?: string;
}

export const MediumTextInput = <T extends string>({...props}: SearchInputProps<T>) => {

    return (
        <div className={`relative ${props.wrapperClassname}`}>
            <input
                onChange={(e) => props.OnChange(e.target.value as T)}
                className={`relative rounded-md w-full p-1 pl-2 pr-8.5 bg-white/90 border border-black/20 text-sm outline-none
                ${props.className}`}
                placeholder={"Search for members..."}
                type="text"/>
            <IoSearch
                className={"absolute top-1/2 -translate-y-1/2 right-3 text-lg text-black/40"}/>
        </div>
    )

}
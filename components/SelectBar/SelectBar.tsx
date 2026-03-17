import React from "react";

type SelectBarProps<T> = {
    options: { label: string, value: T }[],
    value: T,
    onChange: (value: T) => void,
    className?: string,
}

export const SelectBar = <T extends string>({...props}: SelectBarProps<T>) => {


    return (
        <select
            onChange={(e) => props.onChange(e.target.value as T)}
            className={`medium-button bg-gradient-to-b from-white from-30% to-black/8 border border-black/15 text-black outline-none
            ${props.className ?? ""}`}
        >
            {props.options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )

}

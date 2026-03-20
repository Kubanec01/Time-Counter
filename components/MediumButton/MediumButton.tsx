import React, {JSX} from "react";
import {twMerge} from "tailwind-merge";

type ButtonProps = {
    className?: string
    onClick: () => void
    children: JSX.Element | string
}

export const MediumButton = ({...props}: ButtonProps) => {

    return (
        <button
            onClick={() => props.onClick()}
            className={twMerge(
                `medium-button border flex items-center justify-center`, props.className)}>
            {props.children}
        </button>
    )
}
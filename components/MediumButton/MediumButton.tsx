import React, {JSX} from "react";
import {twMerge} from "tailwind-merge";

type ButtonProps = {
    children: JSX.Element | string
    disabled?: boolean
    buttonType?: 'button' | 'submit' | 'reset';
    className?: string
    onClick?: () => void
}

export const MediumButton = ({...props}: ButtonProps) => {

    return (
        <button
            type={props.buttonType}
            disabled={props.disabled}
            onClick={props.onClick}
            className={twMerge(
                `medium-button border flex items-center justify-center`, props.className)}>
            {props.children}
        </button>
    )
}
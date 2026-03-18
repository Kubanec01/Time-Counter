import React, {JSX} from "react";

type ButtonProps = {
    className?: string
    onClick: () => void
    children: JSX.Element | string
}

export const MediumButton = ({...props}: ButtonProps) => {

    return (
        <button
            onClick={() => props.onClick()}
            className={`medium-button border flex items-center justify-center ${props.className}`}>
            {props.children}
        </button>
    )
}
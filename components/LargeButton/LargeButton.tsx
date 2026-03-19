import React, {JSX} from "react";
import {twMerge} from "tailwind-merge";


type LargeButtonProps = {
    children: JSX.Element | string;
    type: "submit" | "reset" | "button"
    disabled?: boolean
    background?: "purpleGradient" | "blackGradient" | "whiteGradient";
    className?: string;
}

export const LargeButton = ({...props}: LargeButtonProps) => {


    return (
        <>
            <button
                type={props.type}
                disabled={props.disabled}
                className={twMerge("medium-button", props.className)}
            >
                {props.children}
            </button>
        </>
    )

}
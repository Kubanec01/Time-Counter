'use client'

import {FaRegCopy} from "react-icons/fa";
import {useState} from "react";

export const CopyTextButton = ({value}: { value: string }) => {

    const [isCopied, setIsCopied] = useState(false);

    const copyText = () => {
        navigator.clipboard.writeText(value)
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1500);
    }

    return (
        <div
            className={"relative"}>
            <button
                type={"button"}
                onClick={() => copyText()}
                className={"text-xs ml-1.5 text-black/40 cursor-pointer hover:text-black/60"}>
                <FaRegCopy/>
            </button>
            <div
                className={`${isCopied ? "opacity-100" : "opacity-0 duration-350"}
                absolute -bottom-6 left-1 text-xs px-1.5 py-0.5 bg-light-green text-dark-green rounded-md`}>
                Copied
            </div>
        </div>
    )
}
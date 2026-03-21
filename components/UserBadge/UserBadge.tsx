import {HiMiniUserCircle} from "react-icons/hi2";
import React from "react";
import {twMerge} from "tailwind-merge";

type UserBadgeProps = {
    userName: string;
    className?: string;
}

const UserBadge = ({...props}: UserBadgeProps) => {

    const bodyClass = "gap-0.5 items-center text-xs font-semibold absolute bg-black/10 py-0.5 px-1 rounded-full top-1.5 left-2 text-custom-gray-800"

    return (
        <>
            <div
                className={twMerge(bodyClass, props.className)}
            >
                <HiMiniUserCircle className={"text-sm"}/>
                {props.userName}
            </div>
        </>
    )
}

export default UserBadge;
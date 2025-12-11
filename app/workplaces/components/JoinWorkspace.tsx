'use client'

import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {useState} from "react";

export const JoinWorkspace = () => {



    const {replace} = useReplaceRouteLink()

    return (
        <div className="w-[312px] flex flex-col justify-center items-center gap-[8px]">
            <h1
                className={"text-lg font-semibold mb-4"}>
                Join Workspace
            </h1>
            {/* Password Input */}
            <input
                placeholder="Workspace Password"
                className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                type="password"
            />
            <button
                className="cursor-pointer w-full h-[43px] mt-[8px] font-medium text-base text-white bg-pastel-purple-700 rounded-[8px]"
            >
                Join
            </button>
            <button
                onClick={() => replace("/")}
                className="cursor-pointer w-full h-[43px] font-medium text-base text-pastel-purple-700 border-2 border-pastel-purple-700 rounded-[8px]"
            >
                Cancel
            </button>
        </div>
    )
}
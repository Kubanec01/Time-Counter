'use client'

import {Dispatch, SetStateAction} from "react";

type MaxTrackingTimeProps = {
    title: string;
    specSubtitle: string;
    value: string;
    activatedButton: "daily" | "weekly";
    setValueAction: Dispatch<SetStateAction<number>>;
    formSubmitFunctionAction: () => void
}

export const MaxTrackingTime = ({...props}: MaxTrackingTimeProps) => {

    const isValueInvalid = Number(props.value) < 1 || Number(props.value) > 24

    return (
        <>
            <div
                className={"border-b border-black/20 pt-3 pb-5"}>
                <h1
                    className={"text-[20px]"}>
                    {props.title}
                </h1>
                <div
                    className={"flex gap-4 mt-1 mb-2"}>
                    <button
                        className={`${props.activatedButton === "daily" ? "bg-vibrant-purple-600 border-vibrant-purple-600 text-white" : ""}
                        px-3 py-0.5 border rounded-full text-sm cursor-pointer`}>
                        Daily
                    </button>
                    <button
                        className={`${props.activatedButton === "weekly" ? "bg-vibrant-purple-600 border-vibrant-purple-600 text-white" : "text-vibrant-purple-600 font-medium"}
                        px-3 py-0.5 border rounded-full text-sm cursor-pointer`}>
                        Weekly
                    </button>
                </div>
                <p
                    className={"text-xs  text-black/50 w-[72%]"}>
                    {props.specSubtitle}
                </p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        props.formSubmitFunctionAction()
                    }}
                    className={"w-[226px] flex gap-2 items-start mt-4"}>
                    <input
                        min={1}
                        max={24}
                        step={1}
                        value={props.value}
                        onChange={(v) => props.setValueAction(Number(v.target.value) * 3600)}
                        className={"border border-black/20 px-2.5 w-2/3 text-sm py-0.5 rounded-full outline-none"}
                        type="number"/>
                    <button
                        type="submit"
                        disabled={isValueInvalid}
                        className={`${isValueInvalid ? " border border-white/10 bg-black/20 text-black/40" : "border border-vibrant-purple-600 text-white bg-vibrant-purple-600 " +
                            "hover:bg-vibrant-purple-700 duration-150 cursor-pointer"} text-sm rounded-full px-3 py-0.5`}>
                        Update
                    </button>
                </form>
            </div>
        </>
    )
}
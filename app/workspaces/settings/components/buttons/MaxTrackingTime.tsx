'use client'

import {Dispatch, SetStateAction} from "react";

type MaxTrackingTimeProps = {
    title: string;
    specSubtitle: string;
    value: string;
    activatedButton: "daily" | "weekly";
    setActivatedButtonAction: Dispatch<SetStateAction<"daily" | "weekly">>;
    setValueAction: Dispatch<SetStateAction<number>>;
    formSubmitFunctionAction: () => void
}

export const MaxTrackingTime = ({...props}: MaxTrackingTimeProps) => {

    const isValueInvalid = () => {
        let isButtonDisabled: boolean
        let maxValue: number;

        if (props.activatedButton === "daily") {
            isButtonDisabled = Number(props.value) < 1 || Number(props.value) > 24
            maxValue = 24
        } else {
            isButtonDisabled = Number(props.value) < 1 || Number(props.value) > 168
            maxValue = 168
        }

        console.log(isButtonDisabled, maxValue)

        return {isButtonDisabled, maxValue}
    }

    return (
        <>
            <div
                className={"border-b border-black/20 pt-3 pb-5"}>
                <h1
                    className={"text-[20px]"}>
                    {props.title}
                </h1>
                <div
                    className={"flex gap-4 mt-2"}>
                    <button
                        onClick={() => props.setActivatedButtonAction("daily")}
                        className={`${props.activatedButton === "daily" ? "bg-vibrant-purple-600 border-vibrant-purple-600 text-white" : "text-vibrant-purple-600 font-medium"}
                        px-3 py-0.5 border rounded-full text-sm cursor-pointer`}>
                        Daily
                    </button>
                    <button
                        onClick={() => props.setActivatedButtonAction("weekly")}
                        className={`${props.activatedButton === "weekly" ? "bg-vibrant-purple-600 border-vibrant-purple-600 text-white" : "text-vibrant-purple-600 font-medium"}
                        px-3 py-0.5 border rounded-full text-sm cursor-pointer`}>
                        Weekly
                    </button>
                </div>
                <p
                    className={"text-xs  text-black/50 w-[72%] mt-4"}>
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
                        max={isValueInvalid().maxValue}
                        step={1}
                        value={props.value}
                        onChange={(v) => props.setValueAction(Number(v.target.value) * 3600)}
                        className={"border border-black/20 px-2.5 w-2/3 text-sm py-0.5 rounded-full outline-none"}
                        type="number"/>
                    <button
                        type="submit"
                        disabled={isValueInvalid().isButtonDisabled}
                        className={`${isValueInvalid().isButtonDisabled ? " border border-white/10 bg-black/20 text-black/40" : "border border-vibrant-purple-600 text-white bg-vibrant-purple-600 " +
                            "hover:bg-vibrant-purple-700 duration-150 cursor-pointer"} text-sm rounded-full px-3 py-0.5`}>
                        Update
                    </button>
                </form>
            </div>
        </>
    )
}
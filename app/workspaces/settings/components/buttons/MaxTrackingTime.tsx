'use client'

import {Dispatch, SetStateAction} from "react";
import {MediumButton} from "@/components/MediumButton/MediumButton";
import {NumberInput} from "@/components/NumberInput/NumberInput";

type MaxTrackingTimeProps = {
    title: string;
    specSubtitle: string;
    value: string;
    activatedButton: "daily" | "weekly";
    setActivatedButtonAction: Dispatch<SetStateAction<"daily" | "weekly">>;
    setValueAction: Dispatch<SetStateAction<number>>;
    formSubmitFunctionAction: () => void
}

const MaxTrackingTime = ({...props}: MaxTrackingTimeProps) => {


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

        return {isButtonDisabled, maxValue}
    }

    const limitBtbClass = (value: string) => `${props.activatedButton === value ? "bg-vibrant-purple-600 border-vibrant-purple-600 text-white" : "text-vibrant-purple-600 font-medium"} py-0.5 border rounded-full`
    const submitBtnClass = `${isValueInvalid().isButtonDisabled ? " border border-white/10 bg-black/20 text-black/40" : "border border-vibrant-purple-600 text-white bg-vibrant-purple-600 " +
        "hover:bg-vibrant-purple-700 duration-150 cursor-pointer"} text-sm rounded-full py-0.5`

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
                    <MediumButton
                        onClick={() => props.setActivatedButtonAction("daily")}
                        className={limitBtbClass('daily')}
                    >
                        Daily
                    </MediumButton>
                    <MediumButton
                        onClick={() => props.setActivatedButtonAction("weekly")}
                        className={limitBtbClass('weekly')}
                    >
                        Weekly
                    </MediumButton>
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
                    className={"w-[226px] flex gap-2 items-start mt-4"}
                >
                    <NumberInput
                        min={1}
                        max={isValueInvalid().maxValue}
                        inputId={"number-limit-input"}
                        value={props.value}
                        inputClassname={'border border-black/20 px-2.5 text-sm py-0.5 rounded-full outline-none'}
                        onChange={(value) => props.setValueAction(Number(value) * 3600)}
                    />
                    <MediumButton
                        buttonType={"submit"}
                        disabled={isValueInvalid().isButtonDisabled}
                        className={submitBtnClass}
                    >
                        Update
                    </MediumButton>
                </form>
            </div>
        </>
    )
}

export default MaxTrackingTime
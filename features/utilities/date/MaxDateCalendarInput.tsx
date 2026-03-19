'use client'

import DatePicker from "react-datepicker";
import React, {Dispatch, SetStateAction} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {FaRegCalendarAlt} from "react-icons/fa";
import {twMerge} from "tailwind-merge";

interface MaxDateProps {
    inputId: string;
    labelText?: string;
    labelClass?: string;
    inputClass?: string;
    selectedDate: Date | null;
    setSelectedDate: Dispatch<SetStateAction<Date | null>>;
}

export const MaxDateCalendarInput = ({...props}: MaxDateProps) => {

    const labelClass = "font-medium text-sm text-black/60"
    const inputClass = "border border-black/20 text-sm w-[140px] focus:outline-vibrant-purple-600 h-[34px] pl-6.5 rounded-md bg-white"

    return (
        <div
            className={"flex flex-col"}>
            <label
                htmlFor={props.inputId}
                className={twMerge(
                    labelClass,
                    props.labelClass
                )}>
                {props.labelText}
            </label>
            <section className={"relative flex items-center"}>
                <DatePicker
                    id={props.inputId}
                    className={twMerge(
                        inputClass,
                        props.inputClass
                    )}
                    selected={props.selectedDate}
                    onChange={props.setSelectedDate}
                    maxDate={new Date()}
                    dateFormat="d.M.yyyy"
                    placeholderText="Select a date"
                />
                <FaRegCalendarAlt className={"absolute left-2 text-sm text-vibrant-purple-600"}/>
            </section>
        </div>
    );
}



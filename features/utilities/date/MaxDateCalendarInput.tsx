'use client'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {FaRegCalendarAlt} from "react-icons/fa";
import {twMerge} from "tailwind-merge";

interface MaxDateProps {
    inputId: string;
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
    labelText?: string;
    labelClass?: string;
    inputClass?: string;
}

export const MaxDateCalendarInput = ({...props}: MaxDateProps) => {

    const labelClass = "font-medium text-sm text-black/60"
    const inputClass = "border border-black/20 text-sm w-[140px] focus:outline-vibrant-purple-600 py-1.5 pl-6.5 rounded-md bg-white"

    return (
        <div
            className={"flex flex-col"}>
            <label
                htmlFor={props.inputId}
                className={twMerge(labelClass, props.labelClass)}>
                {props.labelText}
            </label>
            <section className={"relative flex items-center"}>
                <DatePicker
                    id={props.inputId}
                    className={twMerge(inputClass, props.inputClass)}
                    selected={props.selectedDate}
                    onChange={(date: Date | null) => props.onChange(date)}
                    maxDate={new Date()}
                    dateFormat="d.M.yyyy"
                    placeholderText="Select a date"
                />
                <FaRegCalendarAlt className={"absolute left-2 text-sm text-vibrant-purple-600"}/>
            </section>
        </div>
    );
}



'use client'

import DatePicker from "react-datepicker";
import {Dispatch, SetStateAction} from "react";
import {addDays} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

interface MaxDateProps {
    selectedDate: Date | null;
    setSelectedDate: Dispatch<SetStateAction<Date | null>>;
}

export const MaxDateCalendarInput = ({...props}: MaxDateProps) => {


    return (
        <DatePicker
            className={"border border-black/20 text-sm w-[140px] focus:outline-vibrant-purple-600 p-1.5 px-2 rounded-md bg-white"}
            selected={props.selectedDate}
            onChange={props.setSelectedDate}
            maxDate={addDays(new Date(), 0)}
            dateFormat="d.M.yyyy"
            placeholderText="Select a date"
        />
    );
}



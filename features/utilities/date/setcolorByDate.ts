import {formateDateToDMY} from "@/features/utilities/date/formateDates";

export const setColorByDate = (sectionName: string) => {

    const date = new Date()
    const todayDateString = formateDateToDMY(date)

    if (sectionName === todayDateString) {
        return "bg-linear-to-b from-pastel-purple-500 to-pastel-purple-500"
    } else return `bg-linear-to-b from-pastel-green-600 to-pastel-purple-500`
}
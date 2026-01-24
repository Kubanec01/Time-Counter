import {formateDateToDMY} from "@/features/utilities/date/formateDates";

export const setNameByDate = (sectionName: string) => {
    let sectionValidName = ""

    const date = new Date()
    const todayDateString = formateDateToDMY(date)
    const yesterdayDateString = `${date.getDate() - 1}.${date.getMonth() + 1}.${date.getFullYear()}`

    if (sectionName === todayDateString) {
        sectionValidName = "Today"
    } else if (sectionName === yesterdayDateString) {
        sectionValidName = "Yesterday"
    } else sectionValidName = sectionName

    return sectionValidName
}
import {formateDateToYMD} from "@/features/utilities/date/dateOperations";

export const setNameByDate = (dateToYMD: string) => {
    let sectionValidName = ""

    const date = new Date()
    const todayDateToYMD = formateDateToYMD(date)
    const yesterdayDateToYMD = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}`

    if (dateToYMD === todayDateToYMD) {
        sectionValidName = "Today"
    } else if (dateToYMD === yesterdayDateToYMD) {
        sectionValidName = "Yesterday"
    } else sectionValidName = dateToYMD

    return sectionValidName
}
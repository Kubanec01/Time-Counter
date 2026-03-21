import {formateDateToYMD} from "@/features/utilities/date/dateOperations";
import {subDays} from "date-fns";

export const setNameByDate = (dateToYMD: string) => {
    let sectionValidName = ""

    const date = new Date()
    const currDateToYMD = formateDateToYMD(date)
    const yesterdayDateToYMD = formateDateToYMD(subDays(date, 1))

    if (dateToYMD === currDateToYMD) {
        sectionValidName = "Today"
    } else if (dateToYMD === yesterdayDateToYMD) {
        sectionValidName = "Yesterday"
    } else sectionValidName = dateToYMD

    return sectionValidName
}
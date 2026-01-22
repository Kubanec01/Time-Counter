import {TotalTrackedTime} from "@/types";
import {eachDayOfInterval, endOfWeek, isThisWeek, startOfWeek} from "date-fns";

const currDate = new Date()

export const getThisWeekTRackedDates = (trackedTimes: TotalTrackedTime[]) => {

    return trackedTimes.filter(t => isThisWeek(t.date, {weekStartsOn: 0}))

}

export const getCurrentWeekDays = eachDayOfInterval({
    start: startOfWeek(currDate, {weekStartsOn: 1}),
    end: endOfWeek(currDate, {weekStartsOn: 1})
})

export function timeFormatToHours(time: string) {

    if (time === "0" || time === "0:0:0") return 0

    const [h, m, s] = time.split(":").map(Number)
    return h + m / 60 + s / 3600

}
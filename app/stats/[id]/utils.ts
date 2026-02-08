import {TotalTrackedTime} from "@/types";
import {
    eachDayOfInterval, eachMonthOfInterval,
    endOfMonth,
    endOfWeek, endOfYear,
    isThisMonth,
    isThisWeek, isThisYear,
    startOfMonth,
    startOfWeek,
    startOfYear
} from "date-fns";

const currDate = new Date()

export const getThisWeekTrackedDates = (trackedTimes: TotalTrackedTime[]) => {

    return trackedTimes.filter(t => isThisWeek(t.date, {weekStartsOn: 1}))
}

export function getThisMonthTrackedDates(trackedTimes: TotalTrackedTime[]) {
    return trackedTimes.filter(t => isThisMonth(t.date))
}

export const getThisYearTrackedDates = (trackedTimes: TotalTrackedTime[]) => {
    return trackedTimes.filter(t => isThisYear(t.date))
}

export const getCurrentWeekDays = eachDayOfInterval({
    start: startOfWeek(currDate, {weekStartsOn: 1}),
    end: endOfWeek(currDate, {weekStartsOn: 1})
})

export const getCurrentMonthDays = eachDayOfInterval({
    start: startOfMonth(currDate),
    end: endOfMonth(currDate),
})

export const getCurrentYearMonths = eachMonthOfInterval({
    start: startOfYear(currDate),
    end: endOfYear(currDate),
})


export function timeFormatToHours(time: string) {

    if (time === "0" || time === "0:0:0") return 0

    const [h, m, s] = time.split(":").map(Number)
    return h + m / 60 + s / 3600
}
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
import {TotalDailyTrackedTime} from "@/types";

const currDate = new Date()

export const getThisWeekTrackedDates = (trackedTimes: TotalDailyTrackedTime) => {
    return Object.keys(trackedTimes).filter(date => isThisWeek(date, {weekStartsOn: 1}))

    // return trackedTimes.filter(t => isThisWeek(t.date, {weekStartsOn: 1}))
}

export function getThisMonthTrackedDates(trackedTimes: TotalDailyTrackedTime) {

    return Object.keys(trackedTimes).filter(date => isThisMonth(date))

    // return trackedTimes.filter(t => isThisMonth(t.date))
}

export const getThisYearTrackedDates = (trackedTimes: TotalDailyTrackedTime) => {

    return Object.keys(trackedTimes).filter(date => isThisYear(date))

    // return trackedTimes.filter(t => isThisYear(t.date))
}

export const currentWeekDays = eachDayOfInterval({
    start: startOfWeek(currDate, {weekStartsOn: 1}),
    end: endOfWeek(currDate, {weekStartsOn: 1})
})

export const currentMonthDays = eachDayOfInterval({
    start: startOfMonth(currDate),
    end: endOfMonth(currDate),
})

export const currentYearMonths = eachMonthOfInterval({
    start: startOfYear(currDate),
    end: endOfYear(currDate),
})


export function timeFormatToHours(time: string) {

    if (time === "0" || time === "0:0:0") return 0

    const [h, m, s] = time.split(":").map(Number)
    return h + m / 60 + s / 3600
}


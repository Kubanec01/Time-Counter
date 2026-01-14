import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";


export const stopTimeDifference = (
    totalSeconds: number,
    lastStopClockTime: number,) => {

    const totalDifferenceToSeconds = totalSeconds - lastStopClockTime


    return formatSecondsToTimeString(totalDifferenceToSeconds)

}


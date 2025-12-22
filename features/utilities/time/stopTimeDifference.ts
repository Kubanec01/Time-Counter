import {formatSecondsToTimeString} from "@/features/hooks/timeOperations";


export const stopTimeDifference = (
    totalSeconds: number,
    lastStopClockTime: number,) => {

    const totalDifferenceToSeconds = totalSeconds - lastStopClockTime


    return formatSecondsToTimeString(totalDifferenceToSeconds)

}


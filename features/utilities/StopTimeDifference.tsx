import {formatSecondsToTimeString} from "@/features/hooks/timeOperations";


export const StopTimeDifference = (
    totalSeconds: number,
    lastStopClockTime: number,) => {

    const totalDifferenceToSeconds = totalSeconds - lastStopClockTime


    return formatSecondsToTimeString(totalDifferenceToSeconds)

}

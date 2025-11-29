import {useTimeOperations} from "@/features/hooks/useTimeOperations";


export const StopTimeDifference = (
    totalSeconds: number,
    lastStopClockTime: number,) => {

    const {timeSecondsToFormatedString} = useTimeOperations()

    const totalDifferenceToSeconds = totalSeconds - lastStopClockTime


    return timeSecondsToFormatedString(totalDifferenceToSeconds)

}

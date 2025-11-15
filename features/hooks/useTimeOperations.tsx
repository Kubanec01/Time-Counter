// const differenceToClockFormate = () => {
//     const hours = Math.floor(totalDifferenceToSeconds / 3600)
//     const minutes = Math.floor((totalDifferenceToSeconds % 3600) / 60)
//     const seconds = totalDifferenceToSeconds % 60
//
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     return `${useFormateTime(hours)}:${useFormateTime(minutes)}:${useFormateTime(seconds)}`
// }

import {useFormateTime} from "@/features/hooks/useFormateTime";


export const useTimeOperations = () => {
    const formateTime = useFormateTime()

    const stringTimeToSeconds = (time: string) => {
        const timeArr = time.split(':').map(Number);
        const [h, m, s] = timeArr
        return (h * 3600 + m * 60 + s)
    }

    const timeSecondsToFormatedString = (timeSeconds: number) => {

        const hour = Math.floor(timeSeconds / 3600)
        const minutes = Math.floor((timeSeconds % 3600) / 60)
        const seconds = timeSeconds % 60

        return `${formateTime(hour)}:${formateTime(minutes)}:${formateTime(seconds)}`

    }

    return {stringTimeToSeconds, timeSecondsToFormatedString}
}
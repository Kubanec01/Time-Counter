export const resetClockTime = (newClockTimeInSeconds: number, reset: (offset?: Date, newAutoStart?: boolean) => void
) => {

    const newClockTimeToMilliseconds = newClockTimeInSeconds * 1000

    console.log("clocktime to milisecs", newClockTimeToMilliseconds)

    if (newClockTimeToMilliseconds > 0) {
        const currDateToMilliseconds = new Date().getTime()
        const offset = new Date(currDateToMilliseconds + newClockTimeToMilliseconds)
        reset(offset, false)
    } else {
        console.log("this")
        reset(new Date(), false)
    }
}
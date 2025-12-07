interface ResetClockTimeProps {
    newClockTimeInSeconds: number
    reset: (offset?: Date, newAutoStart?: boolean) => void;
}

export const resetClockTime = (newClockTimeInSeconds: number, reset: (offset?: Date, newAutoStart?: boolean) => void
) => {

    const newClockTimeToMilliseconds = newClockTimeInSeconds * 1000

    if (newClockTimeToMilliseconds > 0) {
        const currDateToMilliseconds = new Date().getTime()
        const offset = new Date(currDateToMilliseconds + newClockTimeToMilliseconds)
        reset(offset, false)
    } else reset(new Date(), false)
}
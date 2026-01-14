
export const formatTimeUnit = (num: number) => num.toString().padStart(2, '0');

export const parseTimeStringToSeconds = (time: string) => {
    const timeArr = time.split(':').map(Number);
    const [h, m, s] = timeArr
    return (h * 3600 + m * 60 + s)
}

export const formatSecondsToTimeString = (timeSeconds: number) => {
    if (timeSeconds < 0) timeSeconds = 0

    const hour = Math.floor(timeSeconds / 3600)
    const minutes = Math.floor((timeSeconds % 3600) / 60)
    const seconds = timeSeconds % 60

    return `${formatTimeUnit(hour)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`

}

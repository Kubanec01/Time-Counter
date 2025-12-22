export const sortDatesAscending = (arr: string[]): string[] => {

    if (arr.length === 0) return []

    const arrToNum = arr.map(date => date.split("/").map(Number))

    for (let i = 0; i < arrToNum.length; i++) {
        for (let j = 0; j < arrToNum.length - 1 - i; j++) {
            let isOlder = false
            const [day, month, year] = arrToNum[j]
            const [day2, month2, year2] = arrToNum[j + 1]

            if (year < year2) {
                isOlder = true
            } else if (year == year2 && month < month2) {
                isOlder = true
            } else if (year === year2 && month === month2 && day < day2) {
                isOlder = true
            }

            if (isOlder) {
                const mid = arrToNum[j]
                arrToNum[j] = arrToNum[j + 1]
                arrToNum[j + 1] = mid
            }
        }
    }

    return arrToNum.map(([day, month, year]) => {
        return `${day}/${month}/${year}`
    })

}
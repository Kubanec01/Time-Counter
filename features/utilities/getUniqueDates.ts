import {UpdatedSectionByDate} from "@/types";


export const getUniqueDates = (arr: UpdatedSectionByDate[]) => {
    if (arr.length === 0) return []

    let newDate = arr[0].date
    const newArr = [arr[0].date]

    for (let i = 1; i < arr.length; i++) {
        let isUnique = true
        const date = arr[i].date;

        for (let j = 0; j < newArr.length; j++) {
            if (date === newDate || date === newArr[j]) {
                isUnique = false
                break
            }
        }
        if (isUnique) {
            newArr.push(date)
            newDate = date
        }
    }
    return newArr
}
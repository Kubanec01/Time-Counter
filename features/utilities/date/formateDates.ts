import {format} from "date-fns";

export const formateDateToDMY = (date: Date | null) => {
    if (date === null) return '';
    return format(date, "dd.M.yyyy");
}

export const formateDateToYMD = (date: Date | null) => {
    if (date === null) return '';
    return format(date, "yyyy-MM-dd");
}

export const formateYMDToDMY = (date: string | undefined) => {
    if (date === undefined) return '';
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`
}
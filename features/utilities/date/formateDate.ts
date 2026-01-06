export const formateDate = (date: Date | null) => {

    if (date === null) return '';

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
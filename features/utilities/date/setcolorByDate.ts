export const setColorByDate = (sectionName: string) => {

    const date = new Date()
    const todayDateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    if (sectionName === todayDateString) {
        return "bg-linear-to-b from-pastel-purple-500 to-pastel-purple-500"
    } else return `bg-linear-to-b from-pastel-green-700 to-pastel-purple-500`
}
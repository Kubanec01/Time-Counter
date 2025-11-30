

export const setColorByDate = (sectionName: string) => {

    const date = new Date()
    const todayDateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    if (sectionName === todayDateString) {
        return "bg-pastel-pink-700"
    } else return `bg-pastel-green-700`
}
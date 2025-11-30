
export const setNameByDate = (sectionName: string) => {
    let sectionValidName = ""

    const date = new Date()
    const todayDateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const yesterdayDateString = `${date.getDate() - 1}/${date.getMonth() + 1}/${date.getFullYear()}`

    if (sectionName === todayDateString) {
        sectionValidName = "Today"
    } else if (sectionName === yesterdayDateString) {
        sectionValidName = "Yesterday"
    } else sectionValidName = sectionName

    return sectionValidName
}
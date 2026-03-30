import ButtonsList from "@/components/ButtonList/ButtonsList";


const SettingsList = () => {


    const listItems: { id: string, title: string, className?: string, onClick: () => void }[] = [
        {
            id: "user-role",
            title: "User Role",
            onClick: () => {
            }
        },
        {
            id: "user-class",
            title: "User Class",
            onClick: () => {
            }
        },
        {
            id: "time-limit",
            title: "Time Limit",
            onClick: () => {
            }
        },
        {
            id: "block-user",
            title: "Block User",
            onClick: () => {
            }
        }
    ]

    return (
        <>
            <ButtonsList
                title={"Settings"}
                listItems={listItems}
            />
        </>
    )
}

export default SettingsList
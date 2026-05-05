import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";
import {NavSettingsButtonSpec} from "@/types";


const NameAndSurname = () => {

    const buttonsList: NavSettingsButtonSpec[] = [
        {
            id: "edit-name",
            title: "Edit Name",
            specSubtitle: "Feel free to change your username to whatever you want; you can always change it back later.",
            navLink: "---",
            bulletPoint: "inactive"
        },
        {
            id: "edit-surname",
            title: "Edit Surname",
            specSubtitle: "Feel free to change your last name to whatever you want; you can always change it back whenever you need to.",
            navLink: "---",
            bulletPoint: "inactive"
        }
    ]

    return (
        <ul>
            {buttonsList.map(buttonItem => (
                <NavButton
                    key={buttonItem.id}
                    id={buttonItem.id}
                    title={buttonItem.title}
                    specSubtitle={buttonItem.specSubtitle}
                    navLink={buttonItem.navLink}
                    bulletPoint={buttonItem.bulletPoint}
                />
            ))}
        </ul>
    )
}


export default NameAndSurname
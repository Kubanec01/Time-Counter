import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";
import {NavSettingsButtonSpec} from "@/types";
import {editUserNamePageUrlPath} from "@/data/Url_Paths/urlPaths";


const NameAndSurname = () => {

    const buttonsList: NavSettingsButtonSpec[] = [
        {
            id: "edit-name",
            title: "Edit Name or Surname",
            specSubtitle: "Feel free to change your username to whatever you want; you can always change it back later.",
            navLink: editUserNamePageUrlPath,
            bulletPoint: "inactive"
        },
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
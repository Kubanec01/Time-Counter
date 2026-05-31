import {NavSettingsButtonSpec} from "@/types";
import {DeleteButton} from "@/app/workspaces/settings/components/buttons/DeleteButton";
import {useSignOutUser} from "@/features/hooks/useSignOutUser";
import {getAuth} from "firebase/auth";
import {mainHomePageUrlPath} from "@/data/Url_Paths/urlPaths";
import LogOutUserModal from "@/components/modals01/LogOutUserModal/LogOutUserModal";
import {useState} from "react";


const AccountOperations = () => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const updateModalView = () => setIsLogoutModalOpen(!isLogoutModalOpen)

    const buttonsList: NavSettingsButtonSpec[] = [
        {
            id: "sign-out",
            title: "Sign Out",
            specSubtitle: "Feel free to sign out whenever you need; your session can be resumed anytime by logging back in.\"",
            navLink: mainHomePageUrlPath,
            onClickFn: updateModalView,
            bulletPoint: "inactive"
        },
        {
            id: "delete-account",
            title: "Delete Account",
            specSubtitle: "Warning: Account deletion is final. All associated data and progress will be wiped from our database and cannot be restored.",
            navLink: "---",
            bulletPoint: "inactive"
        }
    ]


    return (
        <>
            <ul>
                {buttonsList.map(buttonItem => (
                    <DeleteButton
                        key={buttonItem.id}
                        id={buttonItem.id}
                        title={buttonItem.title}
                        onClickFnAction={buttonItem.onClickFn}
                        specSubtitle={buttonItem.specSubtitle}
                        navLink={buttonItem.navLink}
                    />
                ))}
            </ul>
            <LogOutUserModal
                isLogoutModalOpen={isLogoutModalOpen}
                onCancelClickFn={updateModalView}
                onConfirmFn={updateModalView}/>
        </>
    )
}


export default AccountOperations
'use client'

import {NavSettingsButtonSpec} from "@/types";
import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";
import {editUserPasswordPageUrlPath} from "@/data/Url_Paths/urlPaths";
import {getAuth} from "firebase/auth";


const EmailAndPassword = () => {

    const auth = getAuth()
    const userData = auth.currentUser;
    const email = userData?.email;

    const buttonsList: NavSettingsButtonSpec[] = [
        {
            id: "edit-password",
            title: "Change Password",
            specSubtitle: "Feel free to update your password whenever you want; you can change it as often as you need.",
            navLink: editUserPasswordPageUrlPath,
            bulletPoint: "inactive"
        }
    ]

    if(!email) return null;

    return (
        <ul>
            <div
                className={"py-5"}>
                <h1
                    className={"text-[22px]"}>
                    Email in usage
                </h1>
                <p
                    className={" text-xs text-black/50 w-[70%]"}>
                    {email ?? "Loading email..."}
                </p>
            </div>
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


export default EmailAndPassword
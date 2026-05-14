'use client'

import {NavSettingsLinksData, WorkspacesListItem} from "@/types";
import {SettingsTemplateBody} from "@/app/workspaces/settings/components/SettingsTemplateBody";
import {useEffect, useState} from "react";
import NameAndSurname from "@/app/settings/account/components/NameAndSurname/NameAndSurname";
import AccountOperations from "../components/SignOutOrDelete/AccountOperations";
import EmailAndPassword from "@/app/settings/account/components/EmailAndPassword/EmailAndPassword";
import {useParams, useRouter} from "next/navigation";
import {mainHomePageUrlPath} from "@/data/Url_Paths/urlPaths";
import {getUSerWorkspacesList} from "@/features/utilities/userInfoData";
import WorkspacesList from "@/app/settings/account/components/WorkspacesList/WorkspacesList";
import {getAuth} from "firebase/auth";


const UserAccountMainPage = () => {

    const {id} = useParams()
    const auth = getAuth()
    const userId = auth.currentUser?.uid
    const router = useRouter()
    const [primarySectionTitle, setPrimarySectionTitle] =useState('Name and Surname')
    const [workspacesList, setWorkspacesList] = useState<WorkspacesListItem[] | null>(null)
    const [activeNavId, setActiveNavId] = useState('name-and-surname')

    useEffect(() => {
        if(id && userId && id !== userId || (!id || !userId)) return router.replace(mainHomePageUrlPath)

            getUSerWorkspacesList(userId)
                .then(setWorkspacesList)
                .catch(() => console.error('Failed to fetch user workspaces list'))

    }, [id, router, userId]);

const navLinksData: NavSettingsLinksData[] = [
    {
        id: "name-and-surname",
        title: "Name and Surname",
    },
    {
        id: "email-and-password",
        title: "Email and Password",
    },
    {
        id: "workspace-profile",
        title: "Workspace profile",
    },
    {
        id: "account-operations",
        title: "Account operations",
    },
]

    const navTitle = <h1>Manage <br/> Account</h1>

    const primarySectionBody = () => {
        if (activeNavId === 'name-and-surname' ) return <NameAndSurname/>
        else if (activeNavId === 'email-and-password') return <EmailAndPassword/>
        else if (activeNavId === 'account-operations') return <AccountOperations/>
        else if (activeNavId === 'workspace-profile') return <WorkspacesList
        workspacesList={workspacesList ?? []}
        userId={userId}
        />
    }

    if(id !== userId) return null

return (
    <>
        <SettingsTemplateBody
            navbarLinks={navLinksData}
            navTitle={navTitle}
            activeNavId={activeNavId}
            setActiveNavIdAction={setActiveNavId}
            primarySectionTitle={primarySectionTitle}
            setPrimarySectionTitleAction={setPrimarySectionTitle}
            isManageAccountNavVisible={false}
            isUsersWorkspaceAccountsNavInVisible={true}
        >
            {primarySectionBody()}
        </SettingsTemplateBody>
    </>
);
}
export default UserAccountMainPage

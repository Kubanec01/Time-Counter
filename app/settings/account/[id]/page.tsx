'use client'

import {NavSettingsLinksData} from "@/types";
import {SettingsTemplateBody} from "@/app/workspaces/settings/components/SettingsTemplateBody";
import {useState} from "react";
import NameAndSurname from "@/app/settings/account/components/NameAndSurname/NameAndSurname";
import AccountOperations from "../components/SignOutOrDelete/AccountOperations";
import EmailAndPassword from "@/app/settings/account/components/EmailAndPassword/EmailAndPassword";
import {useParams, useRouter} from "next/navigation";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";


const UserAccountMainPage = () => {

    const {id} = useParams()
    const {userId} = useWorkSpaceContext()
    const [primarySectionTitle, setPrimarySectionTitle] =useState('Name and Surname')
    const [activeNavId, setActiveNavId] = useState('name-and-surname')

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
        >
            {primarySectionBody()}
        </SettingsTemplateBody>
    </>
);
}
export default UserAccountMainPage

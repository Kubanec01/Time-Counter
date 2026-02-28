'use client'

import {SettingsBody} from "@/app/workspaces/settings/components/SettingsBody";
import {useState} from "react";
import {WorkspacesProjects} from "@/app/workspaces/settings/components/settingsSections/WorkspacesProjects";
import {NameAndPassword} from "@/app/workspaces/settings/components/settingsSections/NameAndPassword";
import {DeleteButton} from "@/app/workspaces/settings/components/buttons/DeleteButton";


const WorkspaceSettingsHome = () => {


    const [activeNavId, setActiveNavId] = useState("projects");
    const [primarySectionTitle, setPrimarySectionTitle] = useState("Projects");


    const navTitle = <h1>Workspace <br/> Settings</h1>
    const navLinksData: { id: string, title: string }[] = [
        {
            id: "projects",
            title: "Projects",
        },
        {
            id: "edit-name-and-edit-password",
            title: "Name and Password",
        },
        {
            id: "delete-workspace",
            title: "Delete workspace",
        },
    ]

    const sectionPrimaryBody = () => {
        if (activeNavId === "projects") return <WorkspacesProjects/>
        else if (activeNavId === "edit-name-and-edit-password") return <NameAndPassword/>
        else if (activeNavId === "delete-workspace") {
            return <DeleteButton id={"delete"} title={"Delete workspace"}
                                 specSubtitle={"Deleting this workspace will permanently remove all projects, data, user access, and statistics. This action is irreversible. Please proceed with caution."}
                                 navLink={"workspaces/settings/delete"}/>
        }
    }

    return (
        <>
            <SettingsBody
                navTitle={navTitle}
                activeNavId={activeNavId}
                primarySectionTitle={primarySectionTitle}
                setPrimarySectionTitleAction={setPrimarySectionTitle}
                setActiveNavIdAction={setActiveNavId}
                navbarLinks={navLinksData}
            >
                {sectionPrimaryBody()}
            </SettingsBody>
        </>
    )
}

export default WorkspaceSettingsHome
'use client'

import {SettingsBody} from "@/app/workspaces/settings/components/SettingsBody";
import {useState} from "react";
import {WorkspacesProjects} from "@/app/workspaces/settings/components/settingsSections/WorkspacesProjects";
import {NameAndPassword} from "@/app/workspaces/settings/components/settingsSections/NameAndPassword";


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
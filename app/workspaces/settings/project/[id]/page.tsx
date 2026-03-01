'use client'

import {useState} from "react";
import {SettingsBody} from "@/app/workspaces/settings/components/SettingsBody";
import {Stats} from "@/app/workspaces/settings/project/[id]/components/projectSettingsBodySections/Stats";
import {ProjectName} from "@/app/workspaces/settings/project/[id]/components/projectSettingsBodySections/ProjectName";
import {
    CustomizeProject
} from "@/app/workspaces/settings/project/[id]/components/projectSettingsBodySections/CustomizeProject";

export default function ProjectSettingsPage() {


    const [activeNavId, setActiveNavId] = useState("customize");
    const [primarySectionTitle, setPrimarySectionTitle] = useState("Customize Project");

    const navTitle = <h1>Project <br/> Settings</h1>
    const navLinksData: { id: string, title: string }[] = [
        {
            id: "customize",
            title: "Customize",
        },
        {
            id: "stats",
            title: "Stats",
        },
        {
            id: "project-name",
            title: "Project Name",
        },
        {
            id: "delete-project",
            title: "Delete Project",
        },
    ]

    const primarySectionBody = () => {
        if (activeNavId === "stats") return <Stats/>
        else if (activeNavId === "project-name") return <ProjectName/>
        else if (activeNavId === "customize") return <CustomizeProject/>
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
                {primarySectionBody()}
            </SettingsBody>
        </>
    )
}
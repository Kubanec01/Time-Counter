'use client'

import {useState} from "react";
import {SettingsTemplateBody} from "@/app/workspaces/settings/components/SettingsTemplateBody";
import {Stats} from "@/app/workspaces/settings/project/[id]/components/projectSettingsBodySections/Stats";
import {ProjectName} from "@/app/workspaces/settings/project/[id]/components/projectSettingsBodySections/ProjectName";
import {
    CustomizeProject
} from "@/app/workspaces/settings/project/[id]/components/projectSettingsBodySections/CustomizeProject";
import {NavSettingsLinksData} from "@/types";
import DeleteProject
    from "@/app/workspaces/settings/project/[id]/components/projectSettingsBodySections/DeleteProject/DeleteProject";
import {useParams} from "next/navigation";

export default function ProjectSettingsPage() {


    const [activeNavId, setActiveNavId] = useState("customize");
    const [primarySectionTitle, setPrimarySectionTitle] = useState("Customize Project");
    const projectId = useParams().id as string

    console.log('params', projectId)


    const navTitle = <h1>Project <br/> Settings</h1>
    const navLinksData: NavSettingsLinksData[] = [
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
        if (activeNavId === "stats") return <Stats projectId={projectId}/>
        else if (activeNavId === "project-name") return <ProjectName projectId={projectId}/>
        else if (activeNavId === "customize") return <CustomizeProject projectId={projectId}/>
        else if (activeNavId === "delete-project") return <DeleteProject projectId={projectId}/>
    }

    return (
        <>
            <SettingsTemplateBody
                navTitle={navTitle}
                activeNavId={activeNavId}
                primarySectionTitle={primarySectionTitle}
                setPrimarySectionTitleAction={setPrimarySectionTitle}
                setActiveNavIdAction={setActiveNavId}
                navbarLinks={navLinksData}
            >
                {primarySectionBody()}
            </SettingsTemplateBody>
        </>
    )
}
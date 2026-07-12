"use client";

import {Member, ProjectProps} from "@/types";
import {ProjectHero} from "@/components/ProjectHero/ProjectHero";
import {ProjectSections} from "@/app/projects/tracking/[id]/components/ProjectSections";
import CreateEntrySection from "@/app/projects/tracking/[id]/components/CreateEntrySection";
import {LoadingPage} from "@/app/LoadingPage/LoadingPage";
import {useRequiredProject} from "@/features/hooks/useRequiredProject";
import SelectUserBar from "@/app/projects/tracking/[id]/components/SelectUsersBar/SelectUserBar";
import {useEffect, useState} from "react";
import {getAllWorkspaceMembers} from "@/features/utilities/getAllWorkspaceMembers";
import {useWorkSpaceContext} from "@/features/hooks/context/workspaceContext";
import {useRouter} from "next/navigation";
import {setErrorPageUrlPath} from "@/data/Url_Paths/urlPaths";

const TrackingProjectCart = ({...props}: ProjectProps) => {

    const [members, setMembers] = useState<Member[]>([])
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
    const router = useRouter()
    const {workspaceId} = useWorkSpaceContext()
    const {status} = useRequiredProject(props.projectId)

    useEffect(() => {
        getAllWorkspaceMembers(workspaceId)
            .then(setMembers)
            .catch(err => {
                console.error("Failed to fetch members", err);
                router.replace(setErrorPageUrlPath('general'))
            })
    }, [workspaceId]);

    if (!status || status === "loading") return <LoadingPage/>
    else if (status === "not-found") return null

    return (
        <>
            <ProjectHero
                projectSpec={"Tracking"}
                projectName={props.projectName}
            />
            <CreateEntrySection
                projectId={props.projectId}
            />
            <SelectUserBar
                members={members}
                selectedMember={selectedMemberId ?? 'all'}
                onSelectMember={(memberId) => setSelectedMemberId(memberId)}/>
            <ProjectSections
                projectId={props.projectId}
            />
        </>
    );
};

export default TrackingProjectCart;

"use client";

import {onSnapshot} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {Member, ProjectProps, Section, UpdatedSectionByDate} from "@/types";
import {createNewSection} from "@/features/utilities/create/createNewSection";
import {getUniqueDates} from "@/features/utilities/date/getUniqueDates";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {sortDatesAscending} from "@/features/utilities/date/sortDates";
import {ProjectHero} from "@/components/ProjectHero/ProjectHero";
import {useGetProjectName} from "@/features/hooks/useGetProjectName";
import {CreateEntrySection} from "@/app/projects/tracking/[id]/components/CreateEntrySection";
import {ProjectSections} from "@/app/projects/tracking/[id]/components/ProjectSections";

const TrackingProjectCart = ({...props}: ProjectProps) => {

    // States
    const [sections, setSections] = useState<Section[]>([]);
    const [updatedSectionsByDates, setUpdatedSectionsByDates] = useState<string[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | "all">("all");
    const [inputValue, setInputValue] = useState<string>("");
    const [members, setMembers] = useState<Member[]>([]);

    // Variables
    const projectId = props.projectId;

    const {mode, workspaceId, userRole, userId} = useWorkSpaceContext()
    const {projectName} = useGetProjectName(projectId)


    // Fetch Sections Data
    useEffect(() => {
        if (!userId || !projectId) return;
        const userRef = getFirestoreTargetRef(userId, mode, workspaceId);

        const getSectionsData = onSnapshot(userRef, (snap) => {
            if (!snap.exists()) return


            const data = snap.data();
            const sections = data.projectsSections || [];
            const updatedSectionsByDates: UpdatedSectionByDate[] = data.updatedSectionsByDates || []


            if (mode === "workspace" && userRole !== "Member") {
                const membersData: Member[] = data.members
                setMembers(membersData)
            }

            let validSections: Section[] = []

            if (userRole === "Member") {
                validSections = sections.filter(
                    (s: Section) => s.projectId === projectId && s.userId === userId
                );
            } else if (selectedUserId === "all") {
                validSections = sections.filter(
                    (s: Section) => s.projectId === projectId
                );
            } else {
                validSections = sections.filter(
                    (s: Section) => s.projectId === projectId && s.userId === selectedUserId
                );
            }

            const validUpdatedSectionByDates: UpdatedSectionByDate[] = updatedSectionsByDates.filter((u: UpdatedSectionByDate) => validSections.some(s => s.sectionId === u.sectionId));

            const filteredDates = getUniqueDates(validUpdatedSectionByDates)

            setSections(validSections);
            setUpdatedSectionsByDates(sortDatesAscending(filteredDates))
        });

        return () => getSectionsData();
    }, [userId, projectId, mode, workspaceId, userRole, selectedUserId]);


    return (
        <>
            <section
                className={"w-[90%] max-w-medium mx-auto"}
            >
                <ProjectHero projectSpec={"Tracking"} projectName={projectName}/>
                <CreateEntrySection projectId={projectId}/>
                <ProjectSections
                    updatedSectionsByDates={updatedSectionsByDates}
                    sections={sections}
                    projectId={projectId}
                    userId={userId}
                />
            </section>
        </>
    );
};

export default TrackingProjectCart;

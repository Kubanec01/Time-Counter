export interface ProjectProps {
    projectId: string;
    projectName: string
}

export interface TimeCheckout {
    subSectionId: string;
    sectionId: string;
    projectId: string;
    startTime: string;
    stopTime: string;
    clockDifference: string;
    date: string;
}

export interface Section {
    projectId: string;
    sectionId: string;
    title: string;
    time: string;
    updateDate?: string
    category?: LoggingType
}

export interface UpdatedSectionByDate {
    sectionId: string;
    projectId: string;
    date: string;
}

export type UserMode = "solo" | "workspace"
export type WorkspaceId = string | null

export type ProjectType = "tracking" | "logging"

export interface Project {
    projectId: string;
    title: string;
    totalTime: string;
    type: ProjectType
}

export interface SectionCartProps {
    sectionId: string;
    projectId: string;
    title: string;
    userId: string | undefined;
}

export type LoggingType = "Work" | "Research" | "Study" | "Coding" | "Deep Work" | "Custom" | string | null

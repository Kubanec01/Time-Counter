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
    userName: string;
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
export type WorkspaceId = string | "unused"

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
    userName: string;
    title: string;
    userId: string | undefined;
}

export type LoggingType =
    | 'research'
    | 'meeting'
    | 'planning'
    | 'deep-work'
    | 'study'
    | 'coding'
    | 'testing'
    | 'debug'
    | 'personal'
    | 'custom'
    | string
    | null;

export type Role = "Admin" | "Member" | "Manager" | null
export type Member = {
    userId: string;
    email: string;
    name: string;
    surname: string;
    role: Role;
}

export interface WorkSpace {
    adminId: string;
    workSpaceId: string;
    workspaceName: string;
    password: string;
    members: Member[];
    projects: Project[];
}

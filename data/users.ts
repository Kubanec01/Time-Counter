import {ProjectOption} from "@/types";

export const options = [
    {value: "All", label: "Show all"},
    {value: 'Admin', label: 'Admins'},
    {value: 'Manager', label: 'Managers'},
    {value: 'Member', label: 'Members'},
    {value: 'Banned', label: 'Banned'},
];

export const projectTasksOptions: ProjectOption[] = [
    {value: 'research', label: 'Research'},
    {value: 'meeting', label: 'Meeting'},
    {value: 'planning', label: 'Planning'},
    {value: 'deep-work', label: 'Deep Work'},
    {value: 'study', label: 'Study'},
    {value: 'coding', label: 'Coding'},
    {value: 'testing', label: 'Testing'},
    {value: 'debug', label: 'Debug'},
    {value: 'design', label: 'Design'},
    {value: 'documentation', label: 'Documentation'},
    {value: 'emails', label: 'Emails / Communication'},
    {value: 'learning', label: 'Learning'},
    {value: 'personal', label: 'Personal'},
    {value: 'break', label: 'Break / Rest'},
];

export interface UsersClasses {
    id: string,
    name: string,
    options: ProjectOption[],
}

export const usersClasses: UsersClasses[] = [
    {
        id: "frontendClass",
        name: "Frontend",
        options: [
            {value: 'design', label: 'Design'},
            {value: 'frontend-coding', label: 'Coding'},
            {value: 'testing', label: 'Testing'},
            {value: 'debug', label: 'Debug'},
        ],
    },
    {
        id: "technicalClass",
        name: "Technical",
        options: [
            {value: 'backend-coding', label: 'Coding'},
            {value: 'research', label: 'Research'},
            {value: 'deep-work', label: 'Deep Work'},
            {value: 'documentation', label: 'Documentation'},
            {value: 'learning', label: 'Learning'},
        ],
    },
    {
        id: "managementAndPersonalClass",
        name: "Management and Personal",
        options: [
            {value: 'meeting', label: 'Meeting'},
            {value: 'planning', label: 'Planning'},
            {value: 'emails', label: 'Emails / Communication'},
            {value: 'study', label: 'Study'},
            {value: 'personal', label: 'Personal'},
            {value: 'break', label: 'Break / Rest'},
        ]
    },
    {
        id: "uiUxDesignClass",
        name: "UI/UX Design",
        options: [
            {value: 'ui-design', label: 'UI Design'},
            {value: 'ux-design', label: 'UX Design'},
            {value: 'prototyping', label: 'Prototyping'},
            {value: 'design-system', label: 'Design System'},
        ]
    },
    {
        id: "fullStackClass",
        name: "Full stack",
        options: [
            {value: 'feature', label: 'Feature (UI + API)'},
            {value: 'ui-api', label: 'UI ↔ API'},
            {value: 'api-db', label: 'API ↔ Database'},
            {value: 'bugfix', label: 'Bugfix (Full-stack)'},
        ]
    },
]
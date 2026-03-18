import {ProjectOption, UsersClasses} from "@/types";

export const usersFilterOptions = [
    {value: "All", label: "Show all"},
    {value: 'Admin', label: 'Admins'},
    {value: 'Manager', label: 'Managers'},
    {value: 'Member', label: 'Members'},
];

export const projectTasksOptions: ProjectOption[] = [
    {value: 'deep-work', label: 'Deep Work', active: true},
    {value: 'study', label: 'Study', active: true},
    {value: 'coding', label: 'Coding', active: true},
    {value: 'testing', label: 'Testing', active: true},
    {value: 'debug', label: 'Debug', active: true},
    {value: 'design', label: 'Design', active: true},
    {value: 'emails', label: 'Emails / Communication', active: true},
    {value: 'learning', label: 'Learning', active: true},
    {value: 'break', label: 'Break / Rest', active: true},
];

export const usersClasses: UsersClasses[] = [
    {
        id: "frontendClass",
        name: "Frontend",
        options: [
            {value: 'design', label: 'Design', active: true},
            {value: 'frontend-coding', label: 'Coding', active: true},
            {value: 'testing', label: 'Testing', active: true},
            {value: 'debug', label: 'Debug', active: true},
        ],
    },
    {
        id: "technicalClass",
        name: "Technical",
        options: [
            {value: 'backend-coding', label: 'Coding', active: true},
            {value: 'research', label: 'Research', active: true},
            {value: 'deep-work', label: 'Deep Work', active: true},
            {value: 'documentation', label: 'Documentation', active: true},
            {value: 'learning', label: 'Learning', active: true},
        ],
    },
    {
        id: "managementAndPersonalClass",
        name: "Management and Personal",
        options: [
            {value: 'meeting', label: 'Meeting', active: true},
            {value: 'planning', label: 'Planning', active: true},
            {value: 'emails', label: 'Emails / Communication', active: true},
            {value: 'study', label: 'Study', active: true},
            {value: 'personal', label: 'Personal', active: true},
            {value: 'break', label: 'Break / Rest', active: true},
        ]
    },
    {
        id: "uiUxDesignClass",
        name: "UI/UX Design",
        options: [
            {value: 'ui-design', label: 'UI Design', active: true},
            {value: 'ux-design', label: 'UX Design', active: true},
            {value: 'prototyping', label: 'Prototyping', active: true},
            {value: 'design-system', label: 'Design System', active: true},
        ]
    },
    {
        id: "fullStackClass",
        name: "Full stack",
        options: [
            {value: 'feature', label: 'Feature (UI + API)', active: true},
            {value: 'ui-api', label: 'UI ↔ API', active: true},
            {value: 'api-db', label: 'API ↔ Database', active: true},
            {value: 'bugfix', label: 'Bugfix (Full-stack)', active: true},
        ]
    },
]
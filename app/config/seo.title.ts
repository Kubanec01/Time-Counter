const PAGE_TITLE = 'ORION'

export const seoTitle = {
    home: {
        title: PAGE_TITLE
    },
    signIn: {
    title: `${PAGE_TITLE} | Sign in`
    },
    signUp: {
    title: `${PAGE_TITLE} | Sign up`
    },
    loading: {
        title: `${PAGE_TITLE} | Loading...`
    },
    projectPage: (projectName: string) => ({
        title: `${PAGE_TITLE} | Project - ${projectName}`
    }),
    workspacePage: (workspaceName: string) => ({
        title: `${PAGE_TITLE} | ${workspaceName}`
    }),
}
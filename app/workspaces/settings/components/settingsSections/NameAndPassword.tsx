import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";

export const NameAndPassword = () => {


    const data = [
        {
            id: "edit-edit-name",
            title: "Edit workspace name",
            desc: "Changing the workspace edit-name only updates its display edit-name. Your workspace ID and login credentials remain unchanged from the moment the workspace was created.",
            url: "/workspaces/settings/nameAndPassword/edit-name",
        },
        {
            id: "edit-edit-password",
            title: "Edit workspace password",
            desc: "Changing the workspace edit-password may affect user access. Please make sure to inform all workspace members about the edit-password update to avoid login issues.",
            url: "/workspaces/settings/nameAndPassword/edit-password",
        },
    ]

    return (
        <>
            {data.map(item => (
                <NavButton
                    key={item.id}
                    id={item.id}
                    navLink={item.url}
                    title={item.title}
                    specSubtitle={item.desc}
                />
            ))}
        </>
    )
}
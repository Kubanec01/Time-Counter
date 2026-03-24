import {GiSunSpear} from "react-icons/gi";
import {FormEvent, useState} from "react";
import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {createNewWorkspace} from "@/features/utilities/create-&-update/createNewWorkspace";
import {fetchMessages} from "@/messages/errors";
import {Member} from "@/types";
import {setLocalStorageUserMode, setLocalStorageWorkspaceId} from "@/features/utilities/localStorage";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {getAllWorkspaceMembers} from "@/features/utilities/getAllWorkspaceMembers";
import {logIntoWorkspace} from "@/features/utilities/logIntoWorkspace";

type WorkspaceFormProps = {
    workspaceAction: "create" | "join"
}

export const WorkspaceForm = ({...props}: WorkspaceFormProps) => {

    // States
    const [name, setName] = useState("");
    const [workspaceInputId, setWorkspaceInputId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Hooks
    const {replace} = useReplaceRouteLink()
    const {userId, setMode, setWorkspaceId, userName, userSurname, userMail} = useWorkSpaceContext()


    const title = props.workspaceAction === "create" ? "Create your workspace" : "Join to workspace"
    const btnTitle = props.workspaceAction === "create" ? "Create" : "Join"


    const formSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!userId) return


        if (password.trim() === "" || name.trim() === "") return setError('Missing password or name')


        if (props.workspaceAction === "create") {

            const workspaceId = `@${name.replace(/\s/g, "")}${throwRandomNum(1000)}`
            await createNewWorkspace(userId, name, workspaceId, password)

            setName("")
            setPassword("")
            setMode("workspace")
            setWorkspaceId(workspaceId)
            replace("/")
        }

        if ((props.workspaceAction === 'join')) {


            const workspaceMembersData = await getAllWorkspaceMembers(workspaceInputId)

            const newMember: Member = {
                userId: userId,
                email: userMail,
                name: userName,
                surname: userSurname,
                role: "Member",
                class: "unset"
            }

            console.log(workspaceInputId)

            try {
                await logIntoWorkspace(
                    userId,
                    workspaceInputId,
                    password,
                    workspaceMembersData,
                    newMember
                )
                setError("")
            } catch (err) {
                if (err instanceof Error) {
                    if (err.message === fetchMessages.workspaceNotFound) {
                        return setError("Wrong workspace name or password.")
                    } else if (err.message === fetchMessages.wrongPassword) {
                        return setError("Wrong workspace name or password.")
                    } else if (err.message === fetchMessages.invalidPermission) {
                        return setError("You don't have permission to join this workspace.")
                    } else return setError("Something went wrong, try again.")
                }
            }


            setMode("workspace")
            setWorkspaceId(workspaceInputId)
            setWorkspaceInputId("")
            setPassword("")
            setLocalStorageUserMode("workspace")
            setLocalStorageWorkspaceId(workspaceInputId)
        }
    }


    return (
        <div
            className={"w-[290px] border border-black/10 shadow-lg mt-14 rounded-xl bg-white/90 p-6 mx-auto"}
        >
            <GiSunSpear className={"text-3xl mx-auto"}/>
            <h1
                className={"text-center font-semibold mt-3 mb-6"}
            >
                {title}
            </h1>
            <form
                onSubmit={(e) => formSubmit(e)}
                className={"flex flex-col gap-4"}
            >
                <div
                    className={"w-full"}
                >
                    <label
                        htmlFor="create-workspace"
                        className={"text-xs font-bold"}
                    >
                        Workspace name
                    </label>
                    <input
                        className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                        id={"create-&-update-workspace"}
                        onChange={e => {
                            setName(e.target.value)
                            setWorkspaceId(e.target.value)
                            setWorkspaceInputId(e.target.value)
                        }}
                        placeholder={"Enter workspace name"}
                        type="text"/>
                </div>
                <div
                    className={"w-full"}
                >
                    <label
                        htmlFor="create-workspace"
                        className={"text-xs font-bold"}
                    >
                        Password
                    </label>
                    <input
                        className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                        id={"create-&-update-workspace"}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={"Enter workspace password"}
                        type="password"/>
                </div>
                <p
                    className={"text-xs font text-center font-semibold text-red-400"}
                >
                    {error}
                </p>
                <button
                    className={"medium-button bg-black-gradient rounded-lg py-1.5"}
                >
                    {btnTitle}
                </button>
            </form>
        </div>
    )
}
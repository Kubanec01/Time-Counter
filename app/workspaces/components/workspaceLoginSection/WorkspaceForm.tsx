import {GiSunSpear} from "react-icons/gi";
import {FormEvent, useState} from "react";
import {throwRandomNum} from "@/features/utilities/throwRandomNum";
import {createNewWorkspace} from "@/features/utilities/create/createNewWorkspace";
import {invalidUserId} from "@/messages/errors";
import {arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Member, WorkspaceCredentials} from "@/types";
import {setLocalStorageUserMode, setLocalStorageWorkspaceId} from "@/features/utilities/localStorage";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";

type WorkspaceFormProps = {
    workspaceAction: "create" | "join"
}

export const WorkspaceForm = ({...props}: WorkspaceFormProps) => {

    const [name, setName] = useState("");
    const [workspaceInputId, setWorkspaceInputId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const {replace} = useReplaceRouteLink()
    const {userId, setMode, setWorkspaceId, userName, userSurname, userMail} = useWorkSpaceContext()


    const title = props.workspaceAction === "create" ? "Create your workspace" : "Join to workspace"
    const btnTitle = props.workspaceAction === "create" ? "Create" : "Join"


    const formSubmit = async (e: FormEvent) => {
        e.preventDefault()
        console.log("clicked")

        if (password.trim() === "" || name.trim() === "") return setError('Missing password or name')


        if (props.workspaceAction === "create") {

            const workspaceId = `@${name.replace(/\s/g, "")}${throwRandomNum(1000)}`
            await createNewWorkspace(userId, name, workspaceId, password)

            setName("")
            setPassword("")
            setMode("workspace")
            setWorkspaceId(workspaceId)
            replace("/")
        } else {
            if (!userId) throw new Error(invalidUserId)
            const docRef = doc(db, "realms", workspaceInputId);
            const userRef = doc(db, "users", userId)
            const docSnap = await getDoc(docRef)
            const userSnap = await getDoc(userRef)

            if (!docSnap.exists() || !userSnap.exists()) return setError("Wrong password or Id")
            const data = docSnap.data()
            const userData = userSnap.data()
            const correctPassword = data.password
            const blackList: Member[] = data.blackList || []
            const members: Member[] = data.members
            const workspacesList: WorkspaceCredentials[] = userData.workspacesList || []
            if (password !== correctPassword) return setError("Wrong password or Id")
            if (blackList.some(member => member.userId === userId)) return setError("You don't have permission to join this workspace.")
            const workspaceCredential: WorkspaceCredentials = {
                workspaceId: workspaceInputId,
                password: password
            }

            const matchedWorkspace = workspacesList.find(w => w.workspaceId === workspaceInputId)
            const updatedWorkspacesList = workspacesList.map((workspace) => {
                if (workspace.workspaceId !== workspaceInputId) return workspace

                return {...workspace, password: password}
            })
            const setStatesAndReplace = async () => {
                if (matchedWorkspace) {
                    await updateDoc(userRef, {workspacesList: updatedWorkspacesList})
                } else {
                    await updateDoc(userRef, {workspacesList: arrayUnion(workspaceCredential)})
                }
                setMode("workspace")
                setWorkspaceId(workspaceInputId)
                setWorkspaceInputId("")
                setPassword("")
                setLocalStorageUserMode("workspace")
                setLocalStorageWorkspaceId(workspaceInputId)
            }
            const isMember = members.some(member => member.userId === userId)
            if (!isMember) {
                const newMember: Member = {
                    userId: userId,
                    email: userMail,
                    name: userName,
                    surname: userSurname,
                    role: "Member",
                    class: "unset"
                }

                await updateDoc(docRef, {members: arrayUnion(newMember)})
                await setStatesAndReplace()
            } else await setStatesAndReplace()

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
                        id={"create-workspace"}
                        onChange={e => {
                            setName(e.target.value)
                            setWorkspaceId(e.target.value)
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
                        id={"create-workspace"}
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
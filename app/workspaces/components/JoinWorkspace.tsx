'use client'

import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {FormEvent, useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import {invalidUserId} from "@/messages/errors";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {Member, WorkspaceCredentials} from "@/types";
import {WorkspacesListModal} from "@/components/modals/WorkspacesListModal";
import {setLocalStorageUserMode, setLocalStorageWorkspaceId} from "@/features/utilities/localStorage";

export const JoinWorkspace = () => {
    const [workspaceInputId, setWorkspaceInputId] = useState("")
    const [password, setPassword] = useState("")
    const [errMess, setErrMess] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [workspacesList, setWorkspacesList] = useState<WorkspaceCredentials[]>([])

    const {setMode, setWorkspaceId, userName, userSurname, userMail} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink()
    const [user] = useAuthState(auth)
    const userId = user?.uid


    const joinWorkspace = async (e: FormEvent) => {
        e.preventDefault();

        if (workspaceInputId.trim() === "") return setErrMess("Wrong password or Id.")

        if (!userId) throw new Error(invalidUserId)
        const docRef = doc(db, "realms", workspaceInputId)
        const userRef = doc(db, "users", userId)

        if (!docRef || !userRef) return console.error("Could not find docRef or userRef")

        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) return setErrMess("Wrong password or Id")
        const data = docSnap.data()
        const correctPassword = data.password
        const blackList: Member[] = data.blackList || []
        const members: Member[] = data.members

        if (password !== correctPassword) return setErrMess("Wrong password or Id")
        if (blackList.some(member => member.userId === userId)) return setErrMess("You don't have permission to join this workspace.")

        const workspaceCredential: WorkspaceCredentials = {
            workspaceId: workspaceInputId,
            password: password
        }


        const setStatesAndReplace = async () => {
            await updateDoc(userRef, {workspacesList: arrayUnion(workspaceCredential)})
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
                role: "Member"
            }

            await updateDoc(docRef, {members: arrayUnion(newMember)})
            await setStatesAndReplace()
        } else await setStatesAndReplace()

    }

    useEffect(() => {
        if (!userId) return

        const userRef = doc(db, "users", userId)

        const fetchWorkspacesList = onSnapshot(userRef, snap => {
            if (!snap.exists()) return console.error(snap)
            const data = snap.data()
            const workspacesList = data.workspacesList || []
            setWorkspacesList(workspacesList)
        })

        return () => fetchWorkspacesList()
    }, [userId]);

    return (
        <>
            <form
                onSubmit={joinWorkspace}
                className="w-[280px] py-4 rounded-2xl flex flex-col justify-center items-center gap-[8px]">
                <div
                    className={"flex gap-3 items-center mb-4"}>
                    <h1
                        className={"text-lg text-black/60 font-bold"}>
                        Join Workspace
                    </h1>
                    <span
                        className={"text-2xl text-black/55 font-bold"}
                    >/</span>
                    <button
                        disabled={workspacesList.length === 0}
                        type={"button"}
                        onClick={() => setIsModalOpen(true)}
                        className={`${workspacesList.length === 0 ? "text-white/40 bg-black/20 cursor-default" : "cursor-pointer bg-black/30 text-white hover:scale-110 active:scale-95 duration-100 ease-in"} 
                           text-sm px-3 py-1 rounded-full`}>
                        My Work
                    </button>
                </div>
                {/* WorkspaceId Input */}
                <input
                    onChange={e => {
                        setWorkspaceInputId(e.target.value)
                        setErrMess("")
                    }}
                    value={workspaceInputId}
                    placeholder="Workspace Id"
                    className="w-full h-[38px] bg-white  rounded-full text-base px-3 outline-none"
                    type="text"
                />
                {/* Password Input */}
                <input
                    onChange={e => {
                        setErrMess("")
                        setPassword(e.target.value)
                    }}
                    value={password}
                    placeholder="Workspace Password"
                    className="w-full h-[38px] bg-white  rounded-full text-base px-3 outline-none"
                    type="password"
                />
                <h1
                    className={`text-red-500 text-sm font-semibold text-center ${errMess !== "" ? "bg-black/70 px-4 py-1.5 rounded-full" : ""}`}>
                    {errMess}
                </h1>
                <button
                    type="submit"
                    className="cursor-pointer w-full py-1.5 mt-[8px] font-medium text-base text-white bg-black/80 hover:bg-black/75 rounded-full"
                >
                    Join
                </button>
                <button
                    type={"button"}
                    onClick={() => replace("/")}
                    className="cursor-pointer w-full py-1 font-medium text-base text-black/80 border border-black/40 hover:bg-gray-700/5 rounded-full"
                >
                    Go back
                </button>
            </form>
            <WorkspacesListModal
                userId={userId}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                workspacesList={workspacesList}
                setWorkspaceInputId={setWorkspaceInputId}
                setPasswordInputId={setPassword}
            />
        </>
    )
}

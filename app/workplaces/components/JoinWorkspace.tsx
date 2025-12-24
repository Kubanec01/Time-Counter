'use client'

import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {FormEvent, useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import {documentNotFound, invalidUserId} from "@/messages/errors";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {Member} from "@/types";
import {WorkspacesListModal} from "@/components/modals/WorkspacesListModal";

export const JoinWorkspace = () => {
    const [workspaceInputId, setWorkspaceInputId] = useState("")
    const [password, setPassword] = useState("")
    const [errMess, setErrMess] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [workspacesList, setWorkspacesList] = useState<string[]>([])

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

        if (!docSnap.exists()) return console.error(documentNotFound)
        const data = docSnap.data()
        const correctPassword = data.password
        const blackList: Member[] = data.blackList || []
        const members: Member[] = data.members

        if (password !== correctPassword) return setErrMess("Wrong password or Id.")
        if (blackList.some(member => member.userId === userId)) return setErrMess("You do not have permission to join this workspace.")

        const setStatesAndReplace = () => {
            setMode("workspace")
            setWorkspaceId(workspaceInputId)
            setWorkspaceInputId("")
            setPassword("")
            replace("/")
            localStorage.setItem("workingMode", "workspace")
            localStorage.setItem("workspaceId", workspaceInputId)
            console.log("this should be error", localStorage.getItem(("somethingInTheWay")))
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
            await updateDoc(userRef, {workspacesList: arrayUnion(workspaceInputId)})
            setStatesAndReplace()
        } else setStatesAndReplace()

    }

    useEffect(() => {
        if (!userId) return

        const userRef = doc(db, "users", userId)

        const fetchWorkspacesList = onSnapshot(userRef, snap => {
            if (!snap.exists()) return console.error(snap)
            const data = snap.data()
            const workspacesList = data.workspacesList || []
            setWorkspacesList(workspacesList)
            console.log("helloooo")
        })

        return () => fetchWorkspacesList()
    }, [userId]);

    return (
        <>
            <form
                onSubmit={joinWorkspace}
                className="w-[312px] flex flex-col justify-center items-center gap-[8px]">
                <div
                    className={"flex gap-4 items-center mb-4"}>
                    <h1
                        className={"text-lg font-semibold"}>
                        Join Workspace
                    </h1>
                    <span className={"text-3xl"}>/</span>
                    <button
                        type={"button"}
                        onClick={() => setIsModalOpen(true)}
                        className={"px-3 py-1 border rounded-full cursor-pointer"}>
                        My Work
                    </button>
                </div>
                {/* WorkspaceId Input */}
                <input
                    onChange={e => setWorkspaceInputId(e.target.value)}
                    value={workspaceInputId}
                    placeholder="Workspace Id"
                    className="w-full h-[46px] border border-custom-gray-800  rounded-[4px] text-base px-3"
                    type="text"
                />
                {/* Password Input */}
                <input
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    placeholder="Workspace Password"
                    className="w-full h-[46px] border border-custom-gray-800  rounded-[4px] text-base px-3"
                    type="password"
                />
                <h1
                    className={"text-red-500 font-semibold text-center"}>
                    {errMess}
                </h1>
                <button
                    type="submit"
                    className="cursor-pointer w-full h-[43px] mt-[8px] font-medium text-base text-white bg-pastel-purple-700 rounded-[8px]"
                >
                    Join
                </button>
                <button
                    type={"button"}
                    onClick={() => replace("/")}
                    className="cursor-pointer w-full h-[43px] font-medium text-base text-pastel-purple-700 border-2 border-pastel-purple-700 rounded-[8px]"
                >
                    Go back
                </button>
            </form>
            <WorkspacesListModal
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                workspacesList={workspacesList}
                setWorkspaceInputId={setWorkspaceInputId}
            />
        </>
    )
}

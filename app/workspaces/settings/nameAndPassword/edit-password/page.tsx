'use client'

import {FormEvent, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, updateDoc} from "firebase/firestore";
import {ChangeFormModal} from "@/app/workspaces/settings/components/ChangeFormModal";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {useGetWorkspacePassword} from "@/features/hooks/useGetWorkspacePassword";

const WorkspacePassword = () => {

    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSent, setIsFormSent] = useState(false);


    const {workspaceId} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink();
    const {password} = useGetWorkspacePassword()

    const changeWorkspacePassword = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        if (currPassword !== password) {
            setIsLoading(false);
            return setErrMessage("Wrong password, try again...");
        } else if (newPassword !== confirmPassword) {
            setIsLoading(false)
            return setErrMessage("Passwords do not match (≥o≤)");
        } else if (password.trim() === "" || confirmPassword.trim() === "") {
            setIsLoading(false)
            return setErrMessage("Something went wrong, try it gain.");
        }

        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)
        await updateDoc(docRef, {password: password})
        setCurrPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setIsLoading(false);
        setIsFormSent(true);
    }

    const formBody = (
        <form
            onSubmit={changeWorkspacePassword}
            className={"flex flex-col gap-3"}>
            {/* password */}
            <div
                className={"w-full"}
            >
                <label
                    htmlFor="workspace-password"
                    className={"text-xs font-bold"}
                >
                    Workspace password
                </label>
                <input
                    className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                    id={"workspace-password"}
                    onChange={e => {
                        setCurrPassword(e.target.value)
                    }}
                    placeholder={"Enter workspace password"}
                    type="password"/>
            </div>
            {/* new password */}
            <div
                className={"w-full mt-3"}
            >
                <label
                    htmlFor="new-password"
                    className={"text-xs font-bold"}
                >
                    New password
                </label>
                <input
                    className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                    id={"new-password"}
                    onChange={e => {
                        setNewPassword(e.target.value)
                    }}
                    placeholder={"Enter new password"}
                    type="password"/>
            </div>
            {/* confirm new password */}
            <div
                className={"w-full"}
            >
                <label
                    htmlFor="confirm-password"
                    className={"text-xs font-bold"}
                >
                    Confirm password
                </label>
                <input
                    className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                    id={"confirm-password"}
                    onChange={e => {
                        setConfirmPassword(e.target.value)
                    }}
                    placeholder={"Confirm new password"}
                    type="password"/>
            </div>
            <span
                className={"text-center text-sm text-red-600"}>
                {errMessage}
            </span>
            <button
                disabled={isLoading}
                type="submit"
                className={"medium-button bg-black-gradient mt-2"}>
                Change
            </button>
            <button
                type="button"
                onClick={() => replace('/')}
                className={"text-[13px] font-bold text-black/50 mt-1 cursor-pointer hover:underline"}>
                {"Back to Home"}
            </button>
        </form>
    )

    return (
        <section
            className="w-full h-screen flex flex-col justify-center items-center bg-radial from-gradient-purple to-white to-40%">
            <ChangeFormModal
                title={"Change workspace password"}
                confirmText={"Workspace name has been updated!"}
                formSection={formBody}
                isFormSent={isFormSent}
            />
        </section>
    )
}


export default WorkspacePassword
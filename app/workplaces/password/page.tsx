'use client'

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, updateDoc} from "firebase/firestore";

const WorkspacePassword = () => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {workspaceId} = useWorkSpaceContext()

    const router = useRouter();

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword || password.trim() === "" || confirmPassword.trim() === "") {
            setPassword("")
            setConfirmPassword("")
            return console.log("something is wrong");
        }
        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)
        await updateDoc(docRef, {password: password})
        setPassword("")
        setConfirmPassword("")
        router.push("/")
    }

    return (
        <section className="w-full h-screen flex flex-col justify-center items-center">
            <div className="h-[300px] flex flex-col">
                <form
                    onSubmit={handleChangePassword}
                    className="w-[312px] flex flex-col justify-center items-center flex-1 gap-[8px]">
                    <h1
                        className={"mb-2 text-lg"}>Change Workspace password</h1>
                    {/* Password Input */}
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password..."
                        className="w-full h-[46px] border border-custom-gray-800 text-black rounded-[4px] text-base px-3"
                        type="password"
                    />
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password..."
                        className="w-full h-[46px] border border-custom-gray-800 text-black rounded-[4px] text-base px-3"
                        type="password"
                    />
                    <button
                        type="submit"
                        className="w-full h-[43px] mt-[8px] font-medium text-base text-white bg-pastel-purple-700 rounded-[8px]"
                    >
                        Change password
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="w-full h-[43px] mt-[2px] font-medium text-base text-white bg-pastel-purple-700 rounded-[8px]"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </section>
    )
}


export default WorkspacePassword
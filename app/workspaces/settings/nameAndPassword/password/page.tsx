'use client'

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, updateDoc} from "firebase/firestore";
import checkmarkImg from "@/public/purple_checkmark.png"

const WorkspacePassword = () => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const {workspaceId} = useWorkSpaceContext()

    const router = useRouter();

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        if (password !== confirmPassword) {
            setIsLoading(false)
            return setErrMessage("Passwords do not match (≥o≤)");
        }
        if (password.trim() === "" || confirmPassword.trim() === "") {
            setIsLoading(false)
            return setErrMessage("Something went wrong, try it gain.");
        }

        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)
        await updateDoc(docRef, {password: password})
        setPassword("")
        setConfirmPassword("")
        setIsLoading(false);
        setIsChanged(true)
    }

    return (
        <section className="w-full h-screen bg-black/90 flex flex-col justify-center items-center">
            <div className="h-[300px] flex flex-col">
                <form
                    onSubmit={handleChangePassword}
                    className="w-[320px] px-6 pb-6 pt-7 flex flex-col justify-center items-center border border-white/30
                     rounded-xl bg-white/2 gap-[8px]">
                    <h1
                        className={"mb-2 text-white/70 text-center"}>Change Workspace <br/> password</h1>
                    {/* Password Input */}
                    {
                        isChanged
                            ?
                            <>
                                <div
                                    className={"mb-7 mt-4"}>
                                    <img src={checkmarkImg.src} alt="checkmark image"
                                         className={"w-[76%] mx-auto"}/>
                                    <h1
                                        className={"text-white text-center text-sm mt-2"}>
                                        Password was changed.</h1>
                                </div>
                            </>
                            :
                            <>

                                <input
                                    value={password}
                                    onChange={(e) => {
                                        setErrMessage("")
                                        setPassword(e.target.value)
                                    }}
                                    placeholder="New password..."
                                    className="w-full h-[40px] border border-custom-gray-800 text-white/80 rounded-lg outline-none text-sm px-3"
                                    type="password"
                                />
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setErrMessage("")
                                        setConfirmPassword(e.target.value)
                                    }}
                                    placeholder="Confirm password..."
                                    className="w-full h-[40px] border border-custom-gray-800 text-white/80 rounded-lg outline-none text-sm px-3"
                                    type="password"
                                />
                                <h1
                                    className={"text-red-600/90 text-sm -mb-2"}
                                >
                                    {errMessage}
                                </h1>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`${isLoading ? "bg-white/20 text-white/50" : "bg-vibrant-purple-700 " +
                                        " hover:bg-linear-to-t from-vibrant-purple-700 to-vibrant-purple-600 cursor-pointer "} 
                                         w-full h-[34px] mt-6 text-sm font-semibold text-white rounded-full`}
                                >
                                    Change password
                                </button>
                            </>
                    }
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="w-full h-[34px] mt-1 text-sm font-semibold text-white bg-white/20 hover:bg-white/25 cursor-pointer rounded-full"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </section>
    )
}


export default WorkspacePassword
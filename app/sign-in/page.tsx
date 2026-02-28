"use client";

import {FormEvent, useEffect, useState} from "react";
import {auth} from "@/app/firebase/config";
import Link from "next/link";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {onAuthStateChanged, signInWithEmailAndPassword} from "@firebase/auth";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMess, setErrorMess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    const {replace} = useReplaceRouteLink()


    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const resp = await signInWithEmailAndPassword(auth, email, password);

            if (resp?.user) {
                setEmail("");
                setPassword("");
                replace("/");
                setIsLoading(false)
            }

        } catch {
            setIsLoading(false)
            setErrorMess("Incorrect email or edit-password (≥o≤)")
        }
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                replace("/")
            }

            return () => unsub();
        })
    }, []);

    return (
        <section className="w-full h-screen bg-black flex flex-col justify-center items-center">
            <div className="flex flex-col">
                <div
                    className={"flex items-center justify-center mb-4"}
                >
                    <h1
                        className={"font-pacifico text-3xl text-gray-200"}
                    >Welcome back</h1>
                </div>
                <form
                    onSubmit={handleSignIn}
                    className="w-[312px] flex flex-col justify-center items-center flex-1 gap-[8px]">
                    {/* Email Input */}
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email..."
                        className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] tetx-base px-3"
                        type="text"
                    />
                    {/* Password Input */}
                    <div
                        className={"w-full relative flex items-center"}>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password..."
                            className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                            type={`${isPasswordHidden ? "password" : "text"}`}
                        />
                        <IoMdEyeOff
                            onClick={() => setIsPasswordHidden(v => !v)}
                            style={{display: isPasswordHidden ? "block" : "none"}}
                            className={"absolute text-custom-gray-800 text-lg right-2.5 cursor-pointer"}/>
                        <IoMdEye
                            onClick={() => setIsPasswordHidden(v => !v)}
                            style={{display: isPasswordHidden ? "none" : "block"}}
                            className={"absolute text-custom-gray-800 text-lg right-2.5 cursor-pointer"}/>
                    </div>
                    <h1
                        className={"text-red-500/90 text-sm"}>
                        {errorMess}</h1>
                    <button
                        type={"submit"}
                        disabled={isLoading}
                        className={`${isLoading ? "bg-white/25 text-white/60 cursor-base" : "cursor-pointer text-white bg-linear-to-t from-vibrant-purple-500 to-vibrant-purple-400 hover:from-vibrant-purple-600"}
                         w-full h-[43px] mt-[8px] font-medium text-base  rounded-[8px]`}
                    >
                        Log in
                    </button>
                    <button
                        type={"button"}
                        className="cursor-pointer hover:underline text-[14px] text-white mt-[18px]"
                    >
                        Forgot your password?
                    </button>
                    <span
                        className={"text-custom-gray-700/80 text-base mt-[8px]"}>
                        Or don't have an account?
                        <Link className={"text-pastel-purple-700 hover:underline"}
                              href="/sign-up"> Sign up</Link></span>
                </form>
            </div>
        </section>
    );
};

export default SignInPage;

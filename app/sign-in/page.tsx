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

    // Style
    const inputStyle = "w-full py-1.5 border border-custom-gray-800 text-custom-gray-600 rounded-lg px-3 outline-none"


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
        <div className="w-full h-screen bg-black flex relative">
            <h1
                className={"text-white/40 text-sm absolute right-[24px] top-[24px]"}>
                Synto
            </h1>
            <section
                style={{
                    backgroundImage: `url(/signIn-img.png)`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
                className={"w-[36%] max-w-[600px] pl-11 pt-14"}>
                <h1
                    className={"text-white/90 text-2xl w-[70%]"}>
                    Measure, analyze, and optimize your work with confidence.
                </h1>
                <p
                    className={"text-sm text-white/52 w-[80%] mt-2"}>
                    Create a workspace. Build projects. Track time, solo or with your team. Increase your efficiency and
                    organization with precise data.
                </p>
            </section>
            <section className="h-full flex flex-col justify-center items-center flex-1">
                <h1
                    className={"text-white/90 font- text-2xl"}>
                    Welcome back
                </h1>
                <p
                    className={"text-xs text-white/50 mt-2"}>
                    Sign in and take control of your time again.
                </p>
                <form
                    onSubmit={handleSignIn}
                    className="w-[312px] flex flex-col justify-center items-center gap-2 mt-12">
                    {/* Email Input */}
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email..."
                        className={inputStyle}
                        type="text"
                    />
                    {/* Password Input */}
                    <div
                        className={"w-full relative flex items-center"}>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password..."
                            className={`${inputStyle} mt-0.5`}
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
                        className={"text-red-500/90 text-xs mb-2"}>
                        {errorMess}
                    </h1>
                    <button
                        type={"submit"}
                        disabled={isLoading}
                        className={`${isLoading ? "bg-white/30" : "bg-purple-gradient border"} large-button py-2 w-full`}
                    >
                        Log in
                    </button>
                    <button
                        type={"button"}
                        className="cursor-pointer hover:underline text-xs text-white mt-6"
                    >
                        Forgot your password?
                    </button>
                    <span
                        className={"text-custom-gray-700/80 text-base text-sm mt-1"}>
                        {"Or don't have an account?"}
                        <Link className={"text-vibrant-purple-400 hover:underline"}
                              href="/sign-up"> Sign up</Link></span>
                </form>
            </section>
        </div>
    );
};

export default SignInPage;

"use client";

import {FormEvent, useState} from "react";
import {auth} from "@/app/firebase/config";
import Link from "next/link";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {signInWithEmailAndPassword} from "@firebase/auth";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMess, setErrorMess] = useState("");

    const {replace} = useReplaceRouteLink()

    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const resp = await signInWithEmailAndPassword(auth, email, password);

            if (resp?.user) {
                setEmail("");
                setPassword("");
                replace("/");
            }

        } catch {
            setErrorMess("Incorrect email or password.")
        }
    };

    return (
        <section className="w-full h-screen bg-black flex flex-col justify-center items-center">
            <div className="h-[300px] flex flex-col">
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
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password..."
                        className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                        type="password"
                    />
                    <h1
                        className={"text-red-500"}>
                        {errorMess}</h1>
                    <button
                        type={"submit"}
                        className="w-full h-[43px] mt-[8px] font-medium text-base text-white bg-pastel-purple-700 rounded-[8px] cursor-pointer"
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
                        className={"text-custom-gray-800 text-base mt-[8px]"}>
                        Or don't have an account?
                        <Link className={"text-pastel-purple-700 hover:underline"}
                              href="/sign-up"> Sign up</Link></span>
                </form>
            </div>
        </section>
    );
};

export default SignInPage;

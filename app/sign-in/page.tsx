"use client";

import {FormEvent, useEffect, useState} from "react";
import {auth} from "../config/firebase/config";
import Link from "next/link";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {onAuthStateChanged, signInWithEmailAndPassword} from "@firebase/auth";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {seoTitle} from "@/app/config/seo.title";
import {TextHighlighter} from "@/app/sign-in/components/TextHighlighter";
import {useErrorBannerContext} from "@/features/hooks/context/useErrorBannerContext";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const {setErrorCode} = useErrorBannerContext()

    const {replace} = useReplaceRouteLink()

    // Style
    const inputStyle = "w-full sm:py-1.5 py-1 md:text-base text-sm border border-custom-gray-800 text-custom-gray-600 rounded-sm px-3 outline-none"


    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (email.trim().length === 0 || password.trim().length === 0)  {
            setIsLoading(false)
            setErrorCode('EMPTY_INPUTS')
            return
        }

        try {
            const resp = await signInWithEmailAndPassword(auth, email, password);

            if (resp?.user) {
                setEmail("");
                setPassword("");
                replace("/");
                setIsLoading(false)
                setErrorCode(null)
            }

        } catch {
            setIsLoading(false)
            setErrorCode('INVALID_PASSWORD_OR_MAIL')
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
        <>
            <title>{seoTitle.signIn.title}</title>
            <div className="w-full h-screen bg-black flex relative">
                <a
                    href={'#'}
                    target={'_blank'}
                    className={"text-white/40 hover:underline cursor-pointer text-sm absolute right-6 top-6"}>
                    Orion
                </a>
                <section
                    style={{
                        backgroundImage: `url(/signIn-img.png)`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}
                    className={"w-[36%] max-w-114 pl-6 pt-14 md:block hidden"}>
                    <h1
                        className={"text-white/70 text-xl w-[80%]"}>
                        <TextHighlighter>Measure</TextHighlighter>,
                        <TextHighlighter> analyze</TextHighlighter>, and
                        <TextHighlighter> optimize</TextHighlighter> your work with
                        <TextHighlighter> confidence</TextHighlighter>.
                    </h1>
                </section>
                <section className="h-full flex-1 flex justify-center items-center px-4 overflow-hidden">
                    <div
                        className={'border border-white/20 px-4 py-14 rounded-md flex flex-col justify-center items-center'}>
                        <h1
                            className={"text-white/90 text-center md:text-2xl text-lg font-medium"}>
                            Welcome back to ORION.
                        </h1>
                        <p
                            className={"text-sm text-white/50 mt-2 text-center"}>
                            Sign in and take control of your time.
                        </p>
                        <form
                            onSubmit={handleSignIn}
                            className="sm:w-78 w-full max-w-78 flex flex-col justify-center items-center gap-2 mt-10 px-2">
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
                            <button
                                type={"submit"}
                                disabled={isLoading}
                                className={`${isLoading ? "bg-white/30" : "bg-purple-gradient border"} large-button sm:py-2 
                                md:py-1.5 py-1 w-full sm:mt-0 mt-3`}>
                                Log in
                            </button>
                            <button
                                type={"button"}
                                className="cursor-pointer hover:underline text-sm text-white mt-4">
                                Forgot your password?
                            </button>
                            <span
                                className={"text-custom-gray-700 text-center text-sm mt-1"}>
                        {"Or don't have an account?"}
                                <Link className={"text-vibrant-purple-400 hover:underline"}
                                      href="/sign-up"> Sign up</Link></span>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
};

export default SignInPage;

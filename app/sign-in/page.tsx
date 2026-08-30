"use client";

import {FormEvent, useEffect, useState} from "react";
import {auth} from "../config/firebase/config";
import Link from "next/link";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {onAuthStateChanged, signInWithEmailAndPassword} from "@firebase/auth";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {seoTitle} from "@/app/config/seo.title";
import {useErrorBannerContext} from "@/features/hooks/context/useErrorBannerContext";
// import backgroundImg from '../../public/login-background-gradient-desktop.png'
import logoImg from "../../assets/orion-orbit-black.png"
import Image from "next/image";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const {setErrorCode} = useErrorBannerContext()

    const {replace} = useReplaceRouteLink()

    // Style
    const inputStyle = "w-full sm:py-1.5 py-1 h-9 text-sm border border-black/20 text-black rounded-lg px-3 outline-none"


    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (email.trim().length === 0 || password.trim().length === 0) {
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
            <div
                style={{
                    backgroundImage: 'url(/login-background-gradient-desktop.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }}
                className="w-full h-screen  flex relative">
                <a
                    href={'#'}
                    target={'_blank'}
                    className={"text-black/40 font-medium hover:underline cursor-pointer text-sm absolute right-6 top-6"}>
                    Orion
                </a>
                <section className="h-full flex-1 flex justify-center items-center px-4 overflow-hidden">
                    <div
                        className={'sm:border border-black/10  px-4 py-8 rounded-xl flex flex-col justify-center items-center'}>
                        <Image src={logoImg} alt={'logo-img'} width={40} height={40}/>
                        <h1
                            className={"text-black/90 text-center md:text-xl text-lg font-semibold mt-2"}>
                            Welcome back to Orion
                        </h1>
                        <p
                            className={"text-xs text-black/50 mt-1 text-center font-semibold"}>
                            Sign in and take control of your time.
                        </p>
                        <form
                            onSubmit={handleSignIn}
                            className="sm:w-78 w-full max-w-78 flex flex-col justify-center items-center gap-2 mt-6 px-2">
                            {/* Email Input */}
                            <div
                                className={'w-full'}>
                                <label htmlFor="email-login-input" className={'text-sm'}>Email</label>
                                <input
                                    id={'email-login-input'}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email..."
                                    className={`${inputStyle} shadow-black/6 shadow-2xs`}
                                    type="text"
                                />
                            </div>
                            {/* Password Input */}
                            <div
                                className={'w-full'}>
                                <label htmlFor="password-login-input" className={'text-sm'}>Password</label>
                                <div
                                    className={"w-full relative flex items-center"}>
                                    <input
                                        id={'password-login-input'}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Your password..."
                                        className={`${inputStyle} mt-0.5 shadow-black/6 shadow-2xs`}
                                        type={`${isPasswordHidden ? "password" : "text"}`}
                                    />
                                    <IoMdEyeOff
                                        onClick={() => setIsPasswordHidden(v => !v)}
                                        style={{display: isPasswordHidden ? "block" : "none"}}
                                        className={"absolute text-custom-gray-600 hover:text-custom-gray-700 text-lg right-2.5 top-[30%] cursor-pointer"}/>
                                    <IoMdEye
                                        onClick={() => setIsPasswordHidden(v => !v)}
                                        style={{display: isPasswordHidden ? "none" : "block"}}
                                        className={"absolute text-custom-gray-600 hover:text-custom-gray-700 text-lg right-2.5 top-[30%] cursor-pointer"}/>
                                </div>
                            </div>
                            <div
                                className={'w-full flex justify-end items-center mb-4 font-medium'}>
                                <button
                                    type={"button"}
                                    className="cursor-pointer hover:underline text-xs text-black">
                                    Forgot password?
                                </button>
                            </div>
                            <div
                                className={'w-full flex flex-col justify-center items-center gap-3'}>
                                <button
                                    type={"submit"}
                                    disabled={isLoading}
                                    className={`${isLoading ? "bg-black/30" : "bg-purple-gradient border"} large-button rounded-lg sm:py-2 
                                md:py-1.5 py-1 w-full h-9`}>
                                    Log in
                                </button>
                                <button
                                    type={"submit"}
                                    disabled={isLoading}
                                    className={`${isLoading ? "bg-black/30" : "border border-black/16"} large-button rounded-lg sm:py-2 
                                md:py-1.5 py-1 w-full h-9 flex items-center justify-center gap-2`}>
                                    <Image src={'/google-icon.svg'} alt={'google-logo'} width={14} height={14}/>
                                    Continue with Google
                                </button>
                                <button
                                    type={"submit"}
                                    disabled={isLoading}
                                    className={`${isLoading ? "bg-black/30" : "border border-black/16"} large-button rounded-lg sm:py-2 
                                md:py-1.5 py-1 w-full h-9 flex items-center justify-center gap-2`}>
                                    <Image src={'/github-icon.svg'} alt={'google-logo'} width={14} height={14}/>
                                    Continue with Github
                                </button>
                            </div>
                            <span
                                className={"text-custom-gray-700 text-center md:text-sm text-xs mt-6"}>
                                {"Or don't have an account?"}
                                <Link className={"text-vibrant-purple-600 hover:underline"}
                                      href="/sign-up"> Sign up</Link></span>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
};

export default SignInPage;

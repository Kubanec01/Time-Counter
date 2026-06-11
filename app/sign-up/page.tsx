"use client";

import {auth, db} from "../config/firebase/config";
import {FormEvent, useState} from "react";
import Link from "next/link";
import {doc, setDoc} from "firebase/firestore";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {createUserWithEmailAndPassword} from "@firebase/auth";
import {FirebaseError} from "@firebase/app";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useErrorBannerContext} from "@/features/hooks/context/useErrorBannerContext";

const SignUpPage = () => {

    // States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const {setErrorCode} = useErrorBannerContext()

    const {replace} = useReplaceRouteLink()

    const inputStyle = "w-full md:py-1.5 py-1 md:text-base text-sm border border-custom-gray-800 text-custom-gray-600 rounded-sm px-3 outline-none"


    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true)

        if (password !== passwordConfirm) {
            setIsLoading(false);
            return setErrorCode('PASSWORDS_NOT_MATCH')
        } else if (name.trim().length === 0 || surname.trim().length === 0) {
            setIsLoading(false);
            return setErrorCode('EMPTY_INPUTS');
        }

        try {
            const resp = await createUserWithEmailAndPassword(auth, email, password);

            if (resp) {
                await setDoc(doc(db, "users", resp.user.uid), {
                    email: resp.user.email,
                    userId: resp.user.uid,
                    name: name,
                    surname: surname,
                    hasCompletedOnboarding: false,
                });
                setEmail("");
                setPassword("");
                replace("/");
                setIsLoading(false)
                setErrorCode(null)
            }
        } catch (err) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/weak-edit-password":
                        setErrorCode('WEAK_PASSWORD')
                        break;
                    case "auth/email-already-in-use":
                        setErrorCode('EMAIL_ALREADY_EXISTS')
                        break;
                    default:
                        setErrorCode('UNKNOWN_ERROR')
                        break;
                }
            }
            setIsLoading(false)
        }
    };

    return (
        <section className="w-full bg-black h-screen flex flex-col justify-center items-center relative">
            <h1
                className={"text-white/40 text-sm absolute right-6 top-6"}>
                Synto
            </h1>
            <div
                className="border border-custom-gray-800/80 max-w-87.5 w-[90%] rounded-lg flex flex-col md:py-10 py-6 px-5">
                <h1 className="text-white/90 text-center mb-2 text-md-lg text-base font-medium">
                    Sign up to track your time and <br/>
                    keep your projects in
                    line.</h1>
                <form
                    onSubmit={handleSignUp}
                    className="w-full flex flex-col justify-center items-center flex-1 gap-2 mt-md-8 mt-4">
                    {/* Email Input */}
                    <div
                        className={"flex gap-2"}>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name..."
                            className={inputStyle}
                            type="text"
                        />
                        <input
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Your surname..."
                            className={inputStyle}
                            type="text"
                        />

                    </div>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email..."
                        className={inputStyle}
                        type="text"
                    />
                    {/* Password Input */}
                    <div
                        className={"w-full relative flex items-center justify-center"}>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password..."
                            className={inputStyle}
                            type={`${isPasswordHidden ? "password" : "text"}`}
                        />
                        <IoMdEyeOff
                            onClick={() => setIsPasswordHidden(v => !v)}
                            style={{display: isPasswordHidden ? "block" : "none"}}
                            className={"absolute text-custom-gray-700 text-lg right-2.5 cursor-pointer"}/>
                        <IoMdEye
                            onClick={() => setIsPasswordHidden(v => !v)}
                            style={{display: isPasswordHidden ? "none" : "block"}}
                            className={"absolute text-custom-gray-700 text-lg right-2.5 cursor-pointer"}/>
                    </div>
                    {/* Confirm Password Input */}
                    <div
                        className={"w-full relative flex items-center justify-center"}>
                        <input
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="Confirm password..."
                            className={inputStyle}
                            type={`${isPasswordHidden ? "password" : "text"}`}
                        />
                    </div>
                    <button
                        type={"submit"}
                        className={`${isLoading ? "bg-white/30" : "bg-purple-gradient border"} large-button md:py-2 py-1 w-full`}>
                        Sign Up
                    </button>
                    <span
                        className="md:mt-5 mt-4 text-center md:text-sm text-xs text-custom-gray-700/80">
                        Already have account?
                        <Link
                            href="/sign-in"
                            className={"text-vibrant-purple-400 hover:underline"}> Sign In</Link>
                    </span>
                </form>
            </div>
        </section>
    );
};

export default SignUpPage;

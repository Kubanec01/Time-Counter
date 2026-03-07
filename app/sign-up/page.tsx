"use client";

import {auth, db} from "@/app/firebase/config";
import {FormEvent, useState} from "react";
import Link from "next/link";
import {doc, setDoc} from "firebase/firestore";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {createUserWithEmailAndPassword} from "@firebase/auth";
import {FirebaseError} from "@firebase/app";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

const SignUpPage = () => {

    // States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [errMess, setErrMess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    const {replace} = useReplaceRouteLink()

    const inputStyle = "w-full py-1.5 border border-custom-gray-800 text-custom-gray-600 rounded-lg px-3 outline-none"


    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true)

        if (password !== passwordConfirm) {
            setIsLoading(false);
            return setErrMess("Passwords do not match (≥o≤)");
        } else if (name.trim().length === 0 || surname.trim().length === 0) {
            setIsLoading(false);
            return setErrMess("Please fill in all fields 0.o");
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
            }
        } catch (err) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/weak-edit-password":
                        setErrMess("The edit-password is too weak :(")
                        break;
                    case "auth/email-already-in-use":
                        setErrMess("This email is already in use (≥o≤)")
                        break;
                    default:
                        setErrMess("Something went wrong. Please try again.")
                        break;
                }
            }
            setIsLoading(false)
        }
    };

    return (
        <section className="w-full bg-black h-screen flex flex-col justify-center items-center relative">
            <h1
                className={"text-white/40 text-sm absolute right-[24px] top-[24px]"}>
                Synto
            </h1>
            <div
                className="border border-custom-gray-800/80 max-w-[350px] w-[90%] rounded-xl flex flex-col py-10 px-5">
                <h1 className="text-white/90 text-center mb-2">
                    Sign up to track your time and <br/>
                    keep your projects in
                    line.</h1>
                <form
                    onSubmit={handleSignUp}
                    className="w-full flex flex-col justify-center items-center flex-1 gap-2 mt-[32px]">
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
                    <h1
                        className={"text-red-500/90 text-sm"}>
                        {errMess}</h1>
                    <button
                        type={"submit"}
                        className={`${isLoading ? "bg-white/30" : "bg-purple-gradient border"} large-button py-2 w-full`}
                    >
                        Sign Up
                    </button>
                    <span
                        className="mt-5 text-center text-sm text-custom-gray-700/80"
                    >
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

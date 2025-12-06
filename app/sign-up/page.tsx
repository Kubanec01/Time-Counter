"use client";
import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import {FormEvent, useState} from "react";
import Link from "next/link";
import {doc, setDoc} from "firebase/firestore";
import {useReplaceRouteLink} from "@/features/utilities/useReplaceRouteLink";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const {replace} = useReplaceRouteLink()

    const [createUserWithEmailAndPassword] =
        useCreateUserWithEmailAndPassword(auth);

    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (password !== passwordConfirm || name.length === 0 || surname.length === 0) return

        try {
            const resp = await createUserWithEmailAndPassword(email, password);

            if (resp) {
                await setDoc(doc(db, "users", resp.user.uid), {
                    email: resp.user.email,
                    name: name,
                    surname: surname,
                });
                setEmail("");
                setPassword("");
                replace("/");
            } else {
                console.log("Error With Sign Up User");
            }
        } catch (err) {
            console.error("Error Create User With Email Or Password.", err);
        }
    };

    return (
        <section className="w-full bg-black h-screen flex flex-col justify-center items-center">
            <div className="border border-custom-gray-800 max-w-[350px] w-[90%] rounded-[8px] flex flex-col px-5">
                <h1 className="text-[16px] font-semibold text-custom-gray-800 text-center mt-9">
                    Sign up to track your time and <br/>
                    keep your projects in
                    line.</h1>
                <form
                    onSubmit={handleSignUp}
                    className="w-full flex flex-col justify-center items-center flex-1 gap-2 mt-[22px]">
                    {/* Email Input */}
                    <div
                        className={"flex gap-2"}>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name..."
                            className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                            type="text"
                        /> <input
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder="Your surname..."
                        className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                        type="text"
                    />

                    </div>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email..."
                        className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                        type="text"
                    />
                    {/* Password Input */}
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password..."
                        className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                        type="password"
                    />
                    {/* Confirm Password Input */}
                    <input
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Confirm password..."
                        className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                        type="password"
                    />
                    <button
                        type={"submit"}
                        className="text-base font-semibold bg-pastel-purple-700 cursor-pointer text-white rounded-[8px] w-full h-[42px] mt-[8px]"
                    >
                        Sign Up
                    </button>
                    <span
                        className="mt-[32px] text-center text-base text-white mb-9"
                    >
                        Already have account? <br/>
                        <Link
                            href="/sign-in"
                            className={"text-pastel-purple-700 hover:underline"}>Sign In</Link>
                    </span>
                </form>
            </div>
        </section>
    );
};

export default SignUpPage;

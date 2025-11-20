"use client";

import {useState} from "react";
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useRouter} from "next/navigation";
import Link from "next/link";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            const resp = await signInWithEmailAndPassword(email, password);

            if (resp?.user) {
                console.log(resp);
                setEmail("");
                setPassword("");
                router.push("/");
            } else {
                console.log("User Not Found")
            }
        } catch (err) {
            console.error("Error try to Sign In", err);
        }
    };

    return (
        <section className="w-full h-screen bg-black flex flex-col justify-center items-center">
            <div className="h-[300px] flex flex-col">
                <div className="w-[312px] flex flex-col justify-center items-center flex-1 gap-[8px]">
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
                    <button
                        onClick={handleSignIn}
                        className="w-full h-[43px] mt-[8px] font-medium text-base text-white bg-pastel-purple-700 rounded-[8px]"
                    >
                        Log in
                    </button>
                    <button
                        className="cursor-pointer hover:underline text-[14px] text-white mt-[18px]"
                    >
                        Forgot your password?
                    </button>
                    <span
                        className={"text-custom-gray-800 text-base mt-[8px]"}
                    >Or don't have an account? <Link className={"text-pastel-purple-700"} href="/sign-up">Sign up</Link></span>
                    <Link
                        href="/sign-up"
                        className="cursor-pointer "
                    >
                        Forgot password?
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SignInPage;

"use client";
import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {collection, doc, getDocs, setDoc} from "firebase/firestore";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const router = useRouter();

    const [createUserWithEmailAndPassword] =
        useCreateUserWithEmailAndPassword(auth);

    const handleSignUp = async () => {
        try {
            const resp = await createUserWithEmailAndPassword(email, password);

            if (resp?.user) {
                await setDoc(doc(db, "users", resp.user.uid), {
                    email: resp.user.email,
                });
                setEmail("");
                setPassword("");
                router.push("/");
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
                <div className="w-full flex flex-col justify-center items-center flex-1 gap-[8px] mt-[22px]">
                    {/* Email Input */}
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
                    <input
                        // onChange={}
                        placeholder="Confirm password..."
                        className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                        type="password"
                    />
                    <input
                        // onChange={}
                        placeholder="Your name of nickname..."
                        className="w-full h-[46px] border border-custom-gray-800 text-custom-gray-600 rounded-[4px] text-base px-3"
                        type="text"
                    />
                    <button
                        onClick={handleSignUp}
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
                </div>
            </div>
        </section>
    );
};

export default SignUpPage;

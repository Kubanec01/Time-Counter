"use client";

import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const resp = await signInWithEmailAndPassword(email, password);
      console.log(resp);
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (err) {
      console.error("Error try to Sign In", err);
    }
  };

  return (
    <section className="w-full h-screen flex flex-col justify-center items-center">
      <div className="border w-[400px] h-[300px] rounded-2xl flex flex-col px-4">
        <h1 className="text-3xl text-center mt-8">Sign In</h1>
        <div className="w-full flex flex-col justify-center items-center flex-1 gap-4">
          {/* Email Input */}
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email..."
            className="w-full h-[50px] border rounded-2xl text-xl px-3"
            type="text"
          />
          {/* Password Input */}
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password..."
            className="w-full h-[50px] border rounded-2xl text-xl px-3"
            type="password"
          />
          <button
            onClick={handleSignIn}
            className="text-lg border rounded-2xl px-4 py-1"
          >
            Sign In
          </button>
        </div>
      </div>
      <Link
      href="/sign-up"
      className="mt-6 cursor-pointer border-b-none hover:border-b"
      >Don't have account? Sign Up</Link>
    </section>
  );
};

export default page;

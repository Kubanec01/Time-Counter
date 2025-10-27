"use client";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <section className="w-full h-screen flex flex-col justify-center items-center">
      <div className="border w-[400px] h-[300px] rounded-2xl flex flex-col px-4">
        <h1 className="text-3xl text-center mt-8">Sign Up</h1>
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
            onClick={handleSignUp}
            className="text-lg border rounded-2xl px-4 py-1"
          >
            Sign Up
          </button>
        </div>
      </div>
      <Link
        href="/sign-in"
        className="mt-6 cursor-pointer border-b-none hover:border-b"
      >
        Already have account? Sign In
      </Link>
    </section>
  );
};

export default page;

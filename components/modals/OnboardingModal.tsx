import {useEffect, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";

export const OnboardingModal = () => {

    const [isUserOnboarded, setIUserOnboarded] = useState(true);
    const {userId} = useWorkSpaceContext()

    useEffect(() => {

        const fetchOnboardData = async () => {
            if (!userId) return

            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) return

            const data = docSnap.data()
            const isOnboarded: boolean = data.hasCompletedOnboarding || false

            if (!isOnboarded) setIUserOnboarded(false)
        }

        fetchOnboardData()

    }, [userId])

    const confirmOnboarding = async () => {
        if (!userId) return
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, {hasCompletedOnboarding: true})
    }


    return (
        <section
            style={{display: isUserOnboarded ? "none" : "flex"}}
            className={"absolute w-full h-screen flex justify-center items-center z-[2000]"}>
            <div
                className={"w-[90%] max-w-[500px] p-10 bg-white rounded-xl flex flex-col justify-center items-center"}>
                <img src="/party-popper_3146600.png" alt="party-popper-img"/>
                <h1
                    className={"text-xl mt-6"}>
                    Welcome to <span className={"text-vibrant-purple-600 font-bold"}>Trackio</span>.</h1>
                <p>We are very happy you decided to join us!</p>
                <button
                    onClick={() => {
                        confirmOnboarding()
                        setIUserOnboarded(true)
                    }}
                    className={"px-3 py-1.5 rounded-sm bg-vibrant-purple-600 text-white text-sm mt-8 cursor-pointer"}>
                    Go to dashboard
                </button>
            </div>
        </section>
    )
}
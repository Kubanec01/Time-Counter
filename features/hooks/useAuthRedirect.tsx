import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config"


export const useAuthRedirect = () => {

    const router = useRouter()
    const [user, loading] = useAuthState(auth)

    useEffect(() => {

        if (!user && !loading) {
            router.push("/sign-in")
        }
    }, [user, loading, router])
}
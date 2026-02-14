import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config"


export const useAuthRedirect = () => {

    const router = useRouter()
    const [user, loading] = useAuthState(auth)

    useEffect(() => {

        if (loading) return

        if (!user) {
            router.replace('/sign-in')
        }
    }, [user, loading, router])

    return {user, loading}

}
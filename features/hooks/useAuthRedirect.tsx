import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config"
import {signInPageUrlPath} from "@/data/Url_Paths/urlPaths";


export const useAuthRedirect = () => {

    const router = useRouter()
    const [user, loading] = useAuthState(auth)

    useEffect(() => {

        if (loading) return

        if (!user) {
            router.replace(signInPageUrlPath)
        }
    }, [user, loading, router])

    return {user, loading}

}
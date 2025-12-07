import {useRouter} from "next/navigation";


export const useReplaceRouteLink = () => {
    const router = useRouter()

    const replace = (link: string) => {

        return router.replace(link)
    }

    return {replace}
}
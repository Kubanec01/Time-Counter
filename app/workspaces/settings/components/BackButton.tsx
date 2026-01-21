import {MdArrowBackIos} from "react-icons/md";
import {useRouter} from "next/navigation";


export const BackButton = () => {

    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className={"text-white/80 mr-2 cursor-pointer hover:bg-white/10 duration-100 flex items-center justify-center p-1.5 pl-3 rounded-lg"}>
            <MdArrowBackIos/>
        </button>
    )
}
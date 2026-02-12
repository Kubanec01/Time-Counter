import {MdArrowBackIos} from "react-icons/md";
import {useRouter} from "next/navigation";


export const BackButton = () => {

    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className={"text-black/80 cursor-pointer"}>
            <MdArrowBackIos/>
        </button>
    )
}
import {Member, Role} from "@/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {FaCircleUser} from "react-icons/fa6";
import {MdEmail, MdOutlineShield} from "react-icons/md";

interface UserBarProps {
    userId: string;
    name: string;
    surname: string;
    email: string;
    role: Role;
}

export const BannedUserBar = ({...props}: UserBarProps) => {


    const {workspaceId} = useWorkSpaceContext()

    const unbanMember = async (
        userId: string
    ) => {
        if (!workspaceId) return

        const docRef = doc(db, "realms", workspaceId);
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const blackList: Member[] = data.blackList
        const updatedBlackList = blackList.filter(member => member.userId !== userId);
        await updateDoc(docRef, {blackList: updatedBlackList})
    }

    return (
        <>
            <li
                className={"w-full h-[50px] p-3 flex flex-col gap-2 border-b border-black/20"}
            >
                <div
                    className={"flex justify-between items-center"}>
                    <div
                        className={"flex justify-start items-center gap-6"}>

                    <span
                        className={"flex items-center gap-1 font-semibold"}>
                        <FaCircleUser className={"text-sm text-black/60"}/>
                    <h1>{props.name} {props.surname}</h1>
                    </span>
                        <span
                            className={"flex items-center gap-1"}>
                        <MdEmail className={"text-[15px] text-black/60"}/>
                    <h2 className={"text-sm font-semibold"}
                    >{props.email}</h2>
                    </span>
                        <span
                            className={"py-1 px-2 rounded-md bg-red-500/90 text-white text-sm flex items-center gap-0.5"}
                        >
                        <MdOutlineShield className={"mb-0.5"}/>
                        Banned
                    </span>
                    </div>
                    <button
                        onClick={() => unbanMember(props.userId)}
                        className={"px-3 py-[7px] cursor-pointer text-xs text-white bg-black hover:bg-vibrant-purple-700" +
                            " duration-100 ease-in rounded-md"}>
                        Unban Member
                    </button>
                </div>
            </li>
        </>
    )
}
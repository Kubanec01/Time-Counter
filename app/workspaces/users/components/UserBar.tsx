import {Member, Role} from "@/types";
import {arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {FaCircleUser} from "react-icons/fa6";
import {MdEmail, MdOutlineShield, MdShield} from "react-icons/md";

interface UserBarProps {
    userId: string;
    name: string;
    surname: string;
    email: string;
    role: Role;
}

export const UserBar = ({...props}: UserBarProps) => {


    const {workspaceId, userRole} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid

    // Functions
    const setUserRole = async (
        memberId: string,
        role: Role,
    ) => {
        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const members: Member[] = data.members || []
        const updatedMembers = members.map((member: Member) => {
            if (member.userId !== memberId) return member
            return {...member, role: role}
        })

        await updateDoc(docRef, {members: updatedMembers})
        console.log("changed")
    }

    const removeUser = async (
        memberId: string,
        name: string,
        surname: string,
        email: string,
        workspaceId: string | null
    ) => {
        if (!workspaceId || !userId) return
        const docRef = doc(db, "realms", workspaceId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const members: Member[] = data.members
        const updatedMembers = members.filter(member => member.userId !== memberId)

        const bannedMember = {
            name: name,
            surname: surname,
            email: email,
            userId: memberId
        }

        await updateDoc(docRef, {members: updatedMembers, blackList: arrayUnion(bannedMember)})
    }


    return (
        <>
            <li
                className={"w-full h-[84px] p-3 flex flex-col gap-2 border-b border-black/20"}
            >
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
                </div>
                <div
                    className={"flex justify-between items-center w-full"}>
                    <span
                        className={"py-1 px-2 rounded-md bg-black/32 text-white text-sm flex items-center gap-0.5"}
                    >
                        <MdOutlineShield className={"mb-0.5"}/>
                        {props.role}
                    </span>
                    <div
                        className={"flex justify-start items-center gap-4"}>
                        <button
                            onClick={() => setUserRole(props.userId, "Admin")}
                            className={`${userRole === "Admin" ? "block" : "hidden"} px-3 py-2 cursor-pointer text-xs text-white 
                            bg-black hover:bg-linear-to-b from-vibrant-purple-600 to-vibrant-purple-700 duration-100 ease-in rounded-md`}>
                            Make Admin
                        </button>
                        <button
                            onClick={() => setUserRole(props.userId, "Manager")}
                            className={"px-3 py-2 cursor-pointer text-xs text-white bg-black hover:bg-linear-to-b from-vibrant-purple-600 to-vibrant-purple-700 duration-100 ease-in rounded-md"}>
                            Make Manager
                        </button>
                        <button
                            onClick={() => setUserRole(props.userId, "Member")}
                            className={"px-3 py-2 cursor-pointer text-xs text-white bg-black hover:bg-linear-to-b from-vibrant-purple-600 to-vibrant-purple-700 duration-100 ease-in rounded-md"}>
                            Make Member
                        </button>
                        <button
                            onClick={() => removeUser(props.userId, props.name, props.surname, props.email, workspaceId)}
                            className={"px-3 py-2 cursor-pointer text-xs text-white bg-red-500 hover:bg-red-600 duration-100 ease-in rounded-md"}>
                            Remove Member
                        </button>
                    </div>
                </div>
            </li>
        </>
    )
}
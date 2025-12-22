import {Member, Role} from "@/types";
import {arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useAuthState} from "react-firebase-hooks/auth";

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
                className={"w-full border rounded-md p-3 flex flex-col gap-4"}
            >
                <div
                    className={"flex justify-start items-center gap-6"}>
                    <h1>{props.name} {props.surname}</h1>
                    <h2>{props.email}</h2>
                </div>
                <span>Role: {props.role}</span>
                <div
                    className={"flex justify-start items-center gap-4 mt-2"}>
                    <button
                        onClick={() => setUserRole(props.userId, "Admin")}
                        className={`${userRole === "Admin" ? "block" : "hidden"} px-3 py-2 cursor-pointer text-sm text-white bg-black rounded-md`}>
                        Make Admin
                    </button>
                    <button
                        onClick={() => setUserRole(props.userId, "Manager")}
                        className={"px-3 py-2 cursor-pointer text-sm text-white bg-black rounded-md"}>
                        Make Manager
                    </button>
                    <button
                        onClick={() => setUserRole(props.userId, "Member")}
                        className={"px-3 py-2 cursor-pointer text-sm text-white bg-black rounded-md"}>
                        Make Member
                    </button>
                    <button
                        onClick={() => removeUser(props.userId, props.name, props.surname,props.email ,workspaceId)}
                        className={"px-3 py-2 cursor-pointer text-sm text-white bg-red-500 rounded-md"}>
                        Remove Member
                    </button>
                </div>
            </li>
        </>
    )
}
import {Member} from "@/types";
import {ProfileAvatar} from "@/components/ProfileAvatar/ProfileAvatar";


const UserInfo = ({userData}: { userData: Member }) => {

    const userFullname = userData ? `${userData.name} ${userData.surname}` : ""
    const userInitials = userData ? `${userData.name[0]}${userData.surname[0]}` : ""

    return (
        <>
            <div
                className={"w-full relative z-50 mt-16 pl-8"}
            >
                <ProfileAvatar
                    className={"w-[80px] text-3xl text-white/90 border-3 border-white"}
                    userInitials={userInitials}
                />
                <div
                    className={"mt-3 ml-2"}
                >
                    <div
                        className={"flex items-center"}
                    >
                        <h1
                            className={"font-medium"}
                        >
                            {userFullname}
                        </h1>
                        <span
                            className={"px-1.5 py-0.5 text-xs rounded-sm ml-1.5 bg-linear-to-b bg-vibrant-purple-300 text-purple-950 font-medium"}
                        >
                            {userData.role}
                        </span>
                    </div>
                    <p
                        className={"text-xs text-black/60 font-medium"}>
                        {userData.email}
                    </p>
                </div>
            </div>
        </>
    )
}

export default UserInfo;
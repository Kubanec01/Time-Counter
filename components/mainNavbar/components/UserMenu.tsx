import userBgImg from "@/public/gradient-bg.jpg";
import {RiListSettingsLine} from "react-icons/ri";
import {MdLockReset, MdOutlineLogout} from "react-icons/md";
import {Dispatch, SetStateAction} from "react";
import {auth} from "@/app/firebase/config";

interface Props {
    getUserInitials: string | undefined
    userName: string | undefined
    isUserMenuOpen: boolean
    setIsUserMenuOpen: Dispatch<SetStateAction<boolean>>

}

export const UserMenu = ({...props}: Props) => {

    const setVisibility = props.isUserMenuOpen ? "flex" : "hidden";

    return (
        <div
            onMouseLeave={() => props.setIsUserMenuOpen(false)}
            className={`${setVisibility} fixed top-15 right-12.5 rounded-md z-[50] bg-[#1e1e20] flex flex-col gap-2 w-[200px] p-3`}>
            <div
                className={"flex items-center gap-2 mb-2"}>
                <span
                    style={{
                        backgroundImage: `url(${userBgImg.src})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                    className={`aspect-square w-[44px] rounded-[100px]
                         overflow-hidden flex justify-center items-center text-white text-lg`}
                >
                    {props.getUserInitials}
                </span>
                <div
                    className={"text-white"}>
                    <h1 className={"text-sm font-medium"}>{props.userName}</h1>
                    <h2 className={"text-xs"}>Admin</h2>
                </div>
            </div>
            <button
                className={"flex items-center gap-2 text-white text-sm bg-black p-2 rounded-md cursor-pointer"}>
                <RiListSettingsLine className={"text-custom-gray-700"}/> Settings
            </button>
            <button
                className={"flex items-center gap-2 text-white text-sm bg-black p-2 rounded-md cursor-pointer"}>
                <MdLockReset className={"text-custom-gray-700"}/> Change Password
            </button>
            <button
                onClick={() => auth.signOut()}
                className={"flex items-center gap-2 text-white text-sm bg-black p-2 rounded-md cursor-pointer"}>
                <MdOutlineLogout className={"text-custom-gray-700"}/> Log Out
            </button>
        </div>
    )
}
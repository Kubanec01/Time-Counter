'use client'


import {useEffect, useState} from "react";
import {UserMenu} from "@/components/mainNavbar/components/userMenu/UserMenu";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {getHours} from "date-fns";
import {ProfileAvatar} from "@/components/ProfileAvatar/ProfileAvatar";
import {CopyTextButton} from "@/components/CopyTextButton/CopyTextButton";


const Navbar = () => {

    // states
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false)


    const {userInitials, workspaceName, workspaceId, mode, userId, userName} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink()

    const btnStyle = "text-black text-sm duration-150 ease-in-out cursor-pointer hover:bg-black/5 border border-transparent hover:border-black/10 px-3 py-0.5 rounded-md duration-150"

    const welcomeSign = () => {
        const currHour = getHours(new Date())
        const name = userName

        if (currHour >= 6 && currHour <= 11) return `Good morning, ${name} 🌤️`
        else if (currHour > 11 && currHour <= 17) return `Good afternoon, ${name} ☀️️`
        else return `Good evening, ${name} 🌙`

    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true)
    }, [])

    if (!isClient) return (
        <></>
    )

    return (
        <div
            className={`${userId ? "block" : "hidden"} w-[90%] max-w-small backdrop-blur-sm px-4 fixed top-2 left-2/4 -translate-x-2/4 h-[46px]
             rounded-xl z-[40] bg-[#F8F8F8E6] border border-black/20 shadow-xs flex justify-between items-center`}
        >
            {/*Left Side*/}
            <div
                className={"h-full flex justify-start items-center"}>
                <div
                    onClick={() => replace("/")}
                    className={"h-full flex items-center justify-center pr-4 cursor-pointer border-r border-black/10"}
                >
                    <img src={"/Logo.png"} alt={"Logo image"} className={"w-[20px] aspect-square"}/>
                </div>
                <div
                    className={"h-full flex items-center justify-start text-nowrap"}
                >
                    {mode === "solo"
                        ?
                        <div
                            className={"text-black/80 bg-black/4 medium-button ml-[18px] border border-black/10"}
                        >
                            {welcomeSign()}
                        </div>
                        :
                        <>
                            <span className={"text-black font-medium text-sm ml-[22px]"}>
                                {"Workspace >"}
                            </span>
                            <div
                                className={`flex flex-1 items-center justify-center gap-[30px] pl-1.5 h-full w-auto`}>
                            <span
                                className={"text-black/50 font-medium text-sm flex items-center justify-center"}>
                                {workspaceName} /
                                <span className={"text-xs ml-1"}> {workspaceId}</span> <CopyTextButton
                                value={workspaceId}/>
                            </span>
                            </div>
                        </>
                    }
                </div>
            </div>
            {/*Right Side*/}
            <ul
                className={"h-full flex items-center justify-end gap-2"}
            >
                <li>
                    <button
                        className={btnStyle}
                    >
                        Guide
                    </button>
                </li>
                <li>
                    <button
                        className={btnStyle}
                    >
                        Contact us
                    </button>
                </li>
                <li
                    onClick={() => setIsUserMenuOpen(v => !v)}
                    className={"ml-2 cursor-pointer"}
                >
                    <ProfileAvatar userInitials={userInitials}/>
                </li>
            </ul>
            <UserMenu
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpen={setIsUserMenuOpen}/>
        </div>
    )
}
export default Navbar;
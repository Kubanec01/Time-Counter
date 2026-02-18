'use client'


import {useEffect, useState} from "react";
import {RxQuestionMarkCircled} from "react-icons/rx";
import {LuMessageCircleMore} from "react-icons/lu";
import userBgImg from "@/public/gradient-bg.jpg"
import {UserMenu} from "@/components/mainNavbar/components/userMenu/UserMenu";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {getHours} from "date-fns";


const Navbar = () => {

    // states
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false)


    const {userInitials, workspaceName, workspaceId, mode, userId, userName} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink()

    const btnStyle = "text-black font-semibold text-sm duration-150 ease-in-out cursor-pointer hover:bg-black/5 border border-transparent hover:border-black/10 px-3 py-0.5 rounded-md duration-150"

    const welcomeSign = () => {
        const currHour = getHours(new Date())
        const name = userName

        if (currHour >= 6 && currHour <= 11) return `Good morning, ${name} 🌤️`
        else if (currHour > 11 && currHour <= 17) return `Good afternoon, ${name} ☀️️`
        else return `Good evening, ${name} 🌙`

    }

    console.log(userId)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true)
    }, [])

    if (!isClient) return (
        <></>
    )

    return (
        <div
            className={`${userId ? "block" : "hidden"} w-[90%] max-w-[1100px] px-4 fixed top-2 left-2/4 -translate-x-2/4 h-[46px]
             rounded-xl z-[40] bg-[#F8F8F8E6] border border-black/20 shadow-xs flex justify-between items-center`}
        >
            {/*Left Side*/}
            <div
                className={"h-full flex justify-start items-center w-[50%]"}>
                <div
                    onClick={() => replace("/")}
                    className={"h-full w-[38px] flex items-center cursor-pointer justify-start border-r border-black/10 flex-shrink-0"}
                >
                    <img src={"/Logo.png"} alt={"Logo image"} className={"w-[22px] aspect-square"}/>
                </div>
                <div
                    className={"h-full flex items-center justify-start overflow-hidden text-nowrap"}
                >
                    {mode === "solo"
                        ?
                        <div
                            className={"text-black/80 bg-black/6 medium-button ml-[18px] border border-black/10"}
                        >
                            {welcomeSign()}
                        </div>
                        :
                        <>
                            <span className={"text-white text-lg font-light ml-[22px]"}>
                                {"Workspace >"}
                            </span>
                            <div className={`flex items-center justify-center gap-[30px] pl-[16px] h-full w-auto`}>
                            <span
                                className={"text-custom-gray-600 text-lg font-light"}>
                            {workspaceName} / <span className={"text-sm"}>{workspaceId}</span>
                            </span>
                            </div>
                        </>
                    }
                </div>
            </div>
            {/*Right Side*/}
            <ul
                className={"h-full w-[50%] flex items-center justify-end gap-2"}
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
                <li>
                    <button
                        onClick={() => setIsUserMenuOpen(v => !v)}
                        style={{
                            backgroundImage: `url(${userBgImg.src})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                        }}
                        className={`cursor-pointer aspect-square w-[32px] rounded-[100px]
                         overflow-hidden flex justify-center items-center text-white text-[15px] ml-3`}
                    >
                        {userInitials}
                    </button>
                </li>
            </ul>
            <UserMenu
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpen={setIsUserMenuOpen}/>
        </div>
    )
}
export default Navbar;
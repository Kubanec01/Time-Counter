import {useState} from "react";
import {RxQuestionMarkCircled} from "react-icons/rx";
import {LuMessageCircleMore} from "react-icons/lu";
import userBgImg from "@/public/gradient-bg.jpg"
import {UserMenu} from "@/components/mainNavbar/components/userMenu/UserMenu";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";


const Navbar = () => {

    // states
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const {userInitials, workspaceName, workspaceId, mode} = useWorkSpaceContext()


    // Styles
    const rightButtonsStyle = "text-custom-gray-800 hover:text-white duration-150 ease-in-out text-[24px] cursor-pointer"

    return (
        <div
            className={`w-full fixed top-0 left-0 h-[72px] z-[40] bg-black/85 backdrop-blur-sm flex justify-between items-center`}
        >
            {/*Left Side*/}
            <div
                className={"h-full flex justify-start items-center w-[75%]"}>
                <div
                    className={"h-full flex items-center px-[50px] justify-center border-r border-custom-gray-800 flex-shrink-0"}
                >
                    <img src={"/Logo.png"} alt={"Logo image"} className={"w-auto h-auto"}/>
                </div>
                <div
                    className={"h-full flex items-center justify-start overflow-hidden text-nowrap"}
                >
                    {mode === "solo"
                        ?
                        <h1
                            className={"text-white text-lg font-light ml-[22px]"}
                        >
                            {"Projects"} {">"}
                        </h1>
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
                className={"h-full w-[25%] flex items-center justify-end gap-[30px] text-white pr-[50px] pl-10 overflow-hidden"}
            >
                <li>
                    <button
                        className={rightButtonsStyle}
                    >
                        <LuMessageCircleMore/>

                    </button>
                </li>
                <li>
                    <button
                        className={rightButtonsStyle}
                    >
                        <RxQuestionMarkCircled/>
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
                        className={`cursor-pointer aspect-square w-[36px] rounded-[100px]
                         overflow-hidden flex justify-center items-center text-white text-lg`}
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
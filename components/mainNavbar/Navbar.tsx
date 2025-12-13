import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useState} from "react";
import {RxQuestionMarkCircled} from "react-icons/rx";
import {LuMessageCircleMore} from "react-icons/lu";
import {Project} from "@/types";
import userBgImg from "@/public/gradient-bg.jpg"
import {UserMenu} from "@/components/mainNavbar/components/UserMenu";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";


const Navbar = ({projects}: { projects: Project[] }) => {

    // states
    const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const [user] = useAuthState(auth)
    const {replace} = useReplaceRouteLink()
    const {userInitials, workspaceName, mode} = useWorkSpaceContext()


    // Styles
    const visibilityStyle = user ? "flex" : "hidden"
    const projectsMenuStyle = isProjectsMenuOpen ? "flex border-r-1" : "hidden border-r-0";
    const rightButtonsStyle = "text-custom-gray-800 hover:text-white duration-150 ease-in-out text-[24px] cursor-pointer"

    return (
        <div
            className={`${visibilityStyle} w-full fixed top-0 left-0 h-[72px] z-[40] bg-black flex justify-between items-center`}
        >
            {/*Left Side*/}
            <div
                className={"h-full flex"}>
                <div
                    className={"h-full flex items-center px-[50px] justify-center border-r border-custom-gray-800"}
                >
                    <img src={"/Logo.png"} alt={"Logo image"} className={"w-auto h-auto"}/>
                </div>
                <div
                    className={"h-full flex items-center justify-center"}
                >
                    {mode === "solo"
                        ?
                        <>
                            <button
                                onClick={() => setIsProjectsMenuOpen(v => !v)}
                                disabled={projects.length < 1}
                                style={{
                                    cursor: projects.length > 0 ? "pointer" : "default",
                                    color: projects.length > 0 ? "white" : "",
                                }}
                                className={"text-custom-gray-700 text-lg font-light ml-[22px] cursor-pointer"}
                            >
                                {"Projects"} {">"}
                            </button>
                            <ul
                                className={`${projectsMenuStyle} items-center justify-center gap-[30px] border-custom-gray-800 pr-[22px] pl-[22px] h-full w-auto`}
                            >
                                {projects.map((project) => (
                                    <li
                                        onClick={() => replace(`/projects/${project.type}/${project.projectId}`)}
                                        key={project.projectId}
                                        className={"text-custom-gray-600 hover:text-white duration-150 ease-in-out cursor-pointer text-lg font-light"}>
                                        {project.title}
                                    </li>
                                ))}
                            </ul>
                        </>
                        :
                        <>
                            <span className={"text-white text-lg font-light ml-[22px]"}>
                                {"Now in workspace >"}
                            </span>
                            <div className={`flex items-center justify-center gap-[30px] pl-[16px] h-full w-auto`}>
                            <span
                                className={"text-custom-gray-600 text-lg font-light"}>
                            {workspaceName}
                            </span>
                            </div>
                        </>
                    }
                </div>
            </div>
            {/*Right Side*/}
            <ul
                className={"h-full flex items-center justify-center gap-[30px] text-white pr-[50px]"}
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
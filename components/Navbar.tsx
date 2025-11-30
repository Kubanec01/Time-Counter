import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useState} from "react";
import {FaCircleUser} from "react-icons/fa6";
import {RxQuestionMarkCircled} from "react-icons/rx";
import {LuMessageCircleMore} from "react-icons/lu";
import {Project} from "@/types";
import {useRouter} from "next/navigation";
import {useReplaceRouteLink} from "@/features/utilities/useReplaceRouteLink";


const Navbar = ({projects}: { projects: Project[] }) => {

    // states
    const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);

    const [user] = useAuthState(auth)
    const {replace} = useReplaceRouteLink()

    // Styles
    const visibilityStyle = user ? "flex" : "hidden"
    const projectsMenuStyle = isProjectsMenuOpen ? "flex" : "hidden duration-150";
    const rightButtonsStyle = "text-custom-gray-800 hover:text-white duration-150 ease-in-out text-[24px] cursor-pointer"

    return (
        <div
            className={`${visibilityStyle} w-full fixed top-0 left-0 h-[72px] z-[50] bg-black flex justify-between items-center`}
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
                    <button
                        onClick={() => setIsProjectsMenuOpen(v => !v)}
                        className={"text-white text-lg font-light ml-[22px] cursor-pointer"}
                    >
                        {"Projects"} {">"}
                    </button>
                    <ul
                        className={`${projectsMenuStyle} items-center justify-center gap-[30px] border-r border-custom-gray-800 pr-[22px] pl-[32px] h-full w-auto`}
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
                        onClick={() => auth.signOut()}
                        className={"text-pastel-green-700 text-[34px]"}
                    >
                        <FaCircleUser/>
                    </button>
                </li>
            </ul>
        </div>
    )


}


export default Navbar;
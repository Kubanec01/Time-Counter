"use client"

import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useState} from "react";


const Navbar = () => {

    // states
    const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
    console.log(isProjectsMenuOpen);

    const [user] = useAuthState(auth)

    // Styles
    const visibilityStyle = user ? "flex" : "hidden"
    const projectsMenuStyle = isProjectsMenuOpen ? "flex" : "hidden";

    return (
        <div
            className={`${visibilityStyle} w-full absolute top-0 left-0 h-[72px] bg-black flex justify-between items-center`}
        >
            <div
                className={"h-full flex"}>
                <div
                    className={"w-[300px] h-full px-[50px] flex items-center justify-center border-r border-custom-gray-800"}
                >
                    <img src={"/Logo.png"} alt={"Logo image"} className={"w-auto h-auto"}/>
                </div>
                <div
                    className={"h-full flex items-center justify-center"}
                >
                    <button
                        onClick={() => setIsProjectsMenuOpen(v => !v)}
                        className={"text-white text-[20px] font-light ml-[22px] cursor-pointer"}
                    >
                        {"Projects"} {">"}
                    </button>
                    <ul
                        className={`${projectsMenuStyle} items-center justify-center gap-[30px] border-r border-custom-gray-800 pr-[22px] pl-[32px] h-full w-auto`}
                    >
                        <li
                            className={"text-custom-gray-600 hover:text-white duration-150 ease-in-out cursor-pointer text-[20px] font-light"}>
                            Time Clocker
                        </li>
                        <li
                            className={"text-custom-gray-600 hover:text-white duration-150 ease-in-out cursor-pointer text-[20px] font-light"}>
                            Shopping Cart
                        </li>
                        <li
                            className={"text-custom-gray-600 hover:text-white duration-150 ease-in-out cursor-pointer text-[20px] font-light"}>
                            React App Tutoring
                        </li>
                    </ul>
                </div>

            </div>

        </div>
    )


}


export default Navbar;
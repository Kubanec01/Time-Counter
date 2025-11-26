"use client"

import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useState} from "react";
import {FaCircleUser} from "react-icons/fa6";
import {RxQuestionMarkCircled} from "react-icons/rx";
import {LuMessageCircleMore} from "react-icons/lu";
import Link from "next/link";
import {useRouter} from "next/navigation";


const ProjectCartNavbar = ({projectName}: { projectName: string | null }) => {


    // Navigate Routing
    const router = useRouter()

    return (
        <div
            className={`w-full fixed top-0 left-0 h-[72px] bg-black flex justify-between items-center`}
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
                    <span
                        className={"text-white text-[20px] font-light ml-[22px]"}
                    >
                        {"Now working on >"}
                    </span>
                    <div
                        className={`flex items-center justify-center gap-[30px] pl-[16px] h-full w-auto`}
                    >
                        <span
                            className={"text-custom-gray-600 text-[20px] font-light"}>
                            {projectName}
                        </span>
                    </div>
                </div>

            </div>

            {/*Right Side*/}
            <ul
                className={"h-full flex items-center justify-center gap-[30px] text-white pr-[50px]"}
            >
                <li>
                    <button
                        onClick={() => router.replace("/")}
                        className={"flex justify-center items-center cursor-pointer text-base rounded-sm px-[18px] h-[38px] bg-pastel-purple-800 text-white"}
                    >
                        Go back
                    </button>
                </li>
            </ul>
        </div>
    )


}


export default ProjectCartNavbar;
'use client'

import {BsBoxArrowInDownRight} from "react-icons/bs";
import {useRouter} from "next/navigation";

export const NavButton = ({...props}: { id: string, title: string, specSubtitle: string, navLink: string }) => {

    const router = useRouter()


    return (
        <>
            <li
                onClick={() => router.push(props.navLink)}
                className={"border-b border-black/20 pt-3 pb-1 pr-5 cursor-pointer hover:translate-x-3 duration-200"}>
                <div
                    className={"flex items-center justify-between"}>
                    <div
                        className={"w-[80%]"}>
                        <h1
                            className={"text-[20px] font-medium"}>
                            {props.title}
                        </h1>
                        <p
                            className={"flex items-center gap-1 text-xs -mt-1 text-black/50 font-semibold"}>
                            <span className={"text-4xl mb-0.5"}>·</span> {props.specSubtitle}
                        </p>
                    </div>
                    <BsBoxArrowInDownRight
                        className={"text-black/40 -rotate-90 mb-8 text-sm"}/>
                </div>
            </li>
        </>
    )
}
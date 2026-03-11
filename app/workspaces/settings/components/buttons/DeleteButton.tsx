'use client'

import {BsBoxArrowInDownRight} from "react-icons/bs";
import {useRouter} from "next/navigation";


export const DeleteButton = ({...props}: { id: string, title: string, specSubtitle: string, navLink: string }) => {

    const router = useRouter();

    return (
        <>
            <li
                onClick={() => router.push(props.navLink)}
                className={"border-b border-black/20 py-3 pr-5 cursor-pointer hover:translate-x-3 duration-200"}>
                <div
                    className={"flex items-center justify-between"}>
                    <div
                        className={"w-[80%]"}>
                        <h1
                            className={"text-[20px] text-red-500"}>
                            {props.title}
                        </h1>
                        <p
                            className={"flex items-center gap-1 text-xs mt-1 text-black/50 w-[86%]"}>
                            {props.specSubtitle}
                        </p>
                    </div>
                    <BsBoxArrowInDownRight
                        className={"text-black/40 -rotate-90 mb-8 text-sm"}/>
                </div>
            </li>
        </>
    )
}
import {options} from "@/data/users";
import {IoSearch} from "react-icons/io5";
import React from "react";

export type UserRoleFilter = | "All" | "Admin" | "Manager" | "Member" | "Banned";


interface MembersFilterBarProps {
    setRole: React.Dispatch<React.SetStateAction<UserRoleFilter>>
    selectUser: (role: string) => void,
    findUser: (text: string) => void
    isBtnDisabled: boolean,

}

export const MembersFilterBar = ({...props}: MembersFilterBarProps) => {

    return (
        <div
            className={"flex items-center gap-2"}>
            {/* Search members input */}
            <select
                onChange={(event) => {
                    const value = event.target.value as UserRoleFilter;
                    props.setRole(value)
                    props.selectUser(value)
                }}
                className="border border-black/20 w-[120px] outline-none p-1 px-2
                                 rounded-md bg-white cursor-pointer">
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className={"relative w-[340px]"}>
                <input
                    disabled={props.isBtnDisabled}
                    onChange={(e) => props.findUser(e.target.value)}
                    className={"rounded-md w-full p-1 pl-4 pr-8.5 bg-white/90 " +
                        " border border-black/20 outline-none"}
                    placeholder={"Search for members..."}
                    type="text"/>
                <IoSearch
                    className={"absolute top-1/2 -translate-y-1/2 right-3 text-xl text-black/40"}/>
            </div>
        </div>
    )
}
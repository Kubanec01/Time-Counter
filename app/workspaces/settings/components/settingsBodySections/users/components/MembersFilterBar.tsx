import {usersFilterOptions} from "@/data/users";
import {IoSearch} from "react-icons/io5";
import React from "react";

export type UserRoleFilter = | "All" | "Admin" | "Manager" | "Member" | "Blocked"


interface MembersFilterBarProps {
    setRole: React.Dispatch<React.SetStateAction<UserRoleFilter>>
    selectUser: (role: string) => void,
    findUser: (text: string) => void
    isBtnDisabled: boolean,

}

export const MembersFilterBar = ({...props}: MembersFilterBarProps) => {

    const buttonClass = "medium-button bg-gradient-to-b from-white from-30% to-black/8 border border-black/15 text-black outline-none"

    return (
        <div
            className={"flex items-center gap-2 mt-10"}>
            <select
                onChange={(event) => {
                    const value = event.target.value as UserRoleFilter;
                    props.setRole(value)
                    props.selectUser(value)
                }}
                className={buttonClass}>
                {usersFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <button
                onClick={() => {
                    props.setRole("Blocked")
                    props.selectUser("Banned")
                }}
                className={buttonClass}>
                Blocked users
            </button>
            <div className={"relative w-[300px] ml-4"}>
                <input
                    disabled={props.isBtnDisabled}
                    onChange={(e) => props.findUser(e.target.value)}
                    className={"rounded-md w-full p-1 pl-2 pr-8.5 bg-white/90 border border-black/20 text-sm outline-none"}
                    placeholder={"Search for members..."}
                    type="text"/>
                <IoSearch
                    className={"absolute top-1/2 -translate-y-1/2 right-3 text-lg text-black/40"}/>
            </div>
        </div>
    )
}
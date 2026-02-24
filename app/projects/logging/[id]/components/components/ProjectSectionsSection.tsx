import {addDays, isSameDay, subDays} from "date-fns";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import {MaxDateCalendarInput} from "@/features/utilities/date/MaxDateCalendarInput";
import {SectionCart} from "@/app/projects/logging/[id]/components/components/SectionCart";
import React, {useEffect, useState} from "react";
import {Member, Section} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {doc, onSnapshot} from "firebase/firestore";
import {formateDateToYMD} from "@/features/utilities/date/formateDates";
import {db} from "@/app/firebase/config";

interface ProjectSectionsSectionProps {
    projectId: string;
}

export const ProjectSectionsSection = ({...props}: ProjectSectionsSectionProps) => {

    const currDate = new Date();


    const [members, setMembers] = useState<Member[]>([])
    const [filteredMemberId, setFilteredMemberId] = useState<string | "all">("all")
    const [filteredDate, setFilteredDate] = useState<Date | null>(currDate);
    const [sections, setSections] = useState<Section[]>([]);


    const {mode, userRole, workspaceId, userId} = useWorkSpaceContext()

    const isPlusButtonDisabled = () => {
        if (filteredDate === null) return true

        return isSameDay(filteredDate, currDate)
    }


// Single Snapshot Listener
    useEffect(() => {

        const userRef = doc(db, "realms", workspaceId)

        const unsubscribe = onSnapshot(userRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const members = data.members

            setMembers(members)

            // === SECTIONS ===
            const sections: Section[] = data.projectsSections || []
            let currSections: Section[] = []

            if (userRole === "Member") {
                currSections = sections.filter(
                    s => s.projectId === props.projectId &&
                        s.updateDate === formateDateToYMD(filteredDate) &&
                        s.userId === userId
                )
            } else if (filteredMemberId === "all") {
                currSections = sections.filter(
                    s => s.projectId === props.projectId &&
                        s.updateDate === formateDateToYMD(filteredDate)
                )
            } else {
                currSections = sections.filter(
                    s => s.projectId === props.projectId &&
                        s.updateDate === formateDateToYMD(filteredDate) &&
                        s.userId === filteredMemberId
                )
            }

            setSections(currSections)
        })

        return () => unsubscribe()

    }, [filteredDate, filteredMemberId, mode, props.projectId, userId, userRole, workspaceId])


    return (
        <section
            className={"w-[90%] max-w-[1000px] border border-black/5 p-8 mb-30 mx-auto flex flex-col gap-4 rounded-xl shadow-lg bg-white/60"}>
            <div
                className={"flex gap-3"}>
                {members.length < 2 || userRole !== "Member" &&
                    <>
                        <select
                            onChange={(event) => {
                                const value = event.target.value as string | "all";
                                setFilteredMemberId(value);
                            }}
                            className={`border border-black/20 outline-none px-2 h-8.5 w-[120px] text-sm rounded-md bg-white cursor-pointer`}>
                            <option value="all">All Users</option>
                            {members.map((mem) => (
                                <option key={mem.userId} value={mem.userId}>
                                    {mem.name} {mem.surname}
                                </option>
                            ))}
                        </select>
                    </>
                }
                {/* Minus date btn */}
                <button
                    onClick={() => setFilteredDate(subDays(filteredDate ?? new Date(), 1))}
                    className={"border flex justify-center items-center px-2 rounded-md text-white bg-black/24 hover:bg-black/40 cursor-pointer"}>
                    <FaAngleLeft/>
                </button>
                <MaxDateCalendarInput
                    selectedDate={filteredDate}
                    setSelectedDate={setFilteredDate}
                />
                {/* Plus date btn */}
                <button
                    onClick={() => setFilteredDate(addDays(filteredDate ?? new Date(), 1))}
                    disabled={isPlusButtonDisabled()}
                    className={`${isPlusButtonDisabled() ? "cursor-not-allowed" : "cursor-pointer hover:bg-black/40"}
                        er flex justify-center items-center px-2 rounded-md text-white bg-black/24`}>
                    <FaAngleRight/>
                </button>
            </div>
            <section
                className={"w-full rounded-md mx-auto flex flex-col bg-black/18"}>
                <div
                    className={"w-full rounded-t-md bg-gradient-to-b from-vibrant-purple-400 to-vibrant-purple-700 text-white font-semibold flex justify-between items-center px-4 py-2"}>
                    <h1 className={"w-[25%] text-sm"}>Name</h1>
                    <h2 className={"w-[25%] text-sm"}>Type</h2>
                    <span className={"w-[25%] text-sm"}>Time</span>
                    <span className={"w-[25%] text-sm"}>Date</span>
                </div>
                <ul
                    className={"flex flex-col gap-1 p-1"}>
                    {sections.length > 0 ?
                        <>
                            {sections.map(s => (
                                <SectionCart
                                    key={s.sectionId}
                                    userId={s.userId}
                                    projectId={props.projectId}
                                    sectionId={s.sectionId}
                                    title={s.title}
                                    time={s.time}
                                    userName={s.userName}
                                    category={s.category}
                                    updateDate={s.updateDate}
                                />
                            ))}
                        </>
                        :
                        <>
                            <div
                                className={"w-full bg-white rounded-md px-2 py-4 h-full flex items-center justify-center"}>
                                <h1
                                    className={"text-black/50 text-sm font-medium"}>
                                    No tracks found 0.o
                                </h1>
                            </div>
                        </>
                    }
                </ul>
            </section>
        </section>
    )
}
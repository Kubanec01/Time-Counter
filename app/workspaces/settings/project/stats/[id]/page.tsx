'use client'

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Member, Project} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {doc, getDoc} from "firebase/firestore";
import {format} from "date-fns";
import {formateDateToYMD} from "@/features/utilities/date/formateDates";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";
import {secondsToFloatHours} from "@/features/utilities/time/timeOperations";
import {
    FullTrackedTimeChart
} from "@/app/workspaces/settings/project/stats/[id]/components/chartsSections/fullTrackedTimeChart/FullTrackedTimeChart";
import {
    EveryUserTotalTimePieChart
} from "@/app/workspaces/settings/project/stats/[id]/components/chartsSections/EveryUserTotalTimePieChart";
import {
    ProjectTimeProgres
} from "@/app/workspaces/settings/project/stats/[id]/components/chartsSections/ProjectTimeProgres";
import {
    getCurrentMonthDays,
    getCurrentWeekDays, getCurrentYearMonths,
    getThisMonthTrackedDates,
    getThisWeekTrackedDates,
    getThisYearTrackedDates
} from "@/app/workspaces/settings/project/stats/[id]/features/utils";
import {
    ComparativeTimeIndicator
} from "@/app/workspaces/settings/project/stats/[id]/components/chartsSections/fullTrackedTimeChart/ComparativeTimeIndicator";

export default function StatsHome() {

    const [totalTrackedWeekTimes, setTotalTrackedWeekTimes] = useState<number[]>([]);
    const [totalTrackedMonthTimes, setTotalTrackedMonthTimes] = useState<number[]>([]);
    const [totalTrackedYearTimes, setTotalTrackedYearTimes] = useState<(number | null)[]>([]);
    const [membersStats, setMembersStats] = useState<{ value: number, name: string }[]>([]);
    const [projectTotalTime, setProjectTotalTime] = useState<number>(0);


    const {mode, workspaceId, userId} = useWorkSpaceContext()
    const params = useParams()
    const projectId = params.id as string


    useEffect(() => {
        if (!userId) return

        const fetchData = async () => {

            const docRef = doc(db, "realms", workspaceId)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) return console.error(documentNotFound)
            const data = docSnap.data()
            const project: Project = data.projects.find((p: Project) => p.projectId === projectId)
            const totalTrackedTimes = project.totalTrackedTimes
            setProjectTotalTime(project.totalTime)

            const thisWeekData = getThisWeekTrackedDates(totalTrackedTimes)
            const thisMonthData = getThisMonthTrackedDates(totalTrackedTimes)
            const thisYearData = getThisYearTrackedDates(totalTrackedTimes)

            const weekResult = getCurrentWeekDays.map(d => {
                const date = formateDateToYMD(d);
                const item = thisWeekData.find(i => i.date === date)
                return item ? secondsToFloatHours(item.time) : 0
            });

            const monthResult = getCurrentMonthDays.map(d => {
                const date = formateDateToYMD(d);
                const item = thisMonthData.find(i => i.date === date)
                return item ? secondsToFloatHours(item.time) : 0
            })

            const currDate = format(new Date(), "MM")

            const yearResults = getCurrentYearMonths.map(d => {
                let hours = 0
                const date = format(d, "MM")
                const items = thisYearData.filter(i => format(i.date, "MM") === date)
                if (items.find(i => Number(format(i.date, "MM")) <= Number(currDate))) {
                    items.forEach(i => hours += secondsToFloatHours(i.time))
                    return hours
                } else return null
            })

            setTotalTrackedWeekTimes(weekResult)
            setTotalTrackedMonthTimes(monthResult)
            setTotalTrackedYearTimes(yearResults)

            const members: Member[] = data.members
            const membersIndividualTimes = project.membersIndividualTimes

            const membersStates: { value: number, name: string }[] =
                members.filter(m => membersIndividualTimes[m.userId] !== undefined).map((m: Member) => {
                    return {
                        value: secondsToFloatHours(membersIndividualTimes[m.userId].total),
                        name: `${m.name} ${m.surname}`,
                    }
                })

            setMembersStats(membersStates)
        }

        fetchData()

    }, [mode, projectId, userId, workspaceId])

    return (
        <>
            <div
                className={"w-11/12 max-w-medium mx-auto mt-32"}>
                <section
                    className={"w-full mb-3 pl-2"}>
                    <p
                        className={"text-xs text-vibrant-purple-700 font-medium"}>
                        Statistics</p>
                    <h1
                        className={"text-3xl"}>
                        Project overview</h1>
                    <p
                        className={"text-sm text-black/50 mt-0.5 font-medium"}>
                        All your key tracked data in one place</p>
                </section>
                <section
                    className={"h-[610px] grid grid-cols-3 grid-rows-2 gap-2 bg-black/12 p-4 rounded-xl"}>
                    <FullTrackedTimeChart
                        totalTrackedWeekTimes={totalTrackedWeekTimes}
                        totalTrackedMonthTimes={totalTrackedMonthTimes}
                        totalTrackedYearTimes={totalTrackedYearTimes}
                    />
                    <ComparativeTimeIndicator/>
                    <EveryUserTotalTimePieChart
                        projectTotalTimeValue={projectTotalTime}
                        membersStats={membersStats}
                    />
                    <ProjectTimeProgres
                        projectTotalTimeValue={projectTotalTime}
                        totalTrackedYearTimes={totalTrackedYearTimes}
                    />
                </section>
            </div>
        </>
    )
}
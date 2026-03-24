'use client'

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Member} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {format} from "date-fns";
import {formateDateToYMD} from "@/features/utilities/date/dateOperations";
import {formatDateToMM, formatSecondsToFloatHours} from "@/features/utilities/time/timeOperations";
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
    currentMonthDays,
    currentWeekDays,
    currentYearMonths
} from "@/app/workspaces/settings/project/stats/[id]/features/utils";
import {
    ComparativeTimeIndicator
} from "@/app/workspaces/settings/project/stats/[id]/components/chartsSections/fullTrackedTimeChart/ComparativeTimeIndicator";
import {useProjectData} from "@/features/hooks/useProjectData";
import {getAllWorkspaceMembers} from "@/features/utilities/getAllWorkspaceMembers";

export default function StatsHome() {

    // States
    const [totalTrackedWeekTimes, setTotalTrackedWeekTimes] = useState<number[]>([]);
    const [totalTrackedMonthTimes, setTotalTrackedMonthTimes] = useState<number[]>([]);
    const [totalTrackedYearTimes, setTotalTrackedYearTimes] = useState<(number | null)[]>([]);
    const [membersStats, setMembersStats] = useState<{ value: number, name: string }[]>([]);
    const [projectTotalTime, setProjectTotalTime] = useState<number>(0);

    // Hooks
    const params = useParams()
    const projectId = params.id as string
    const {mode, workspaceId, userId} = useWorkSpaceContext()
    const projectdata = useProjectData(workspaceId, projectId)


    useEffect(() => {
        if (!userId || !projectdata || workspaceId === 'unused') return

        const updateData = async () => {
            const members = await getAllWorkspaceMembers(workspaceId)
            const membersIndividualTimes = projectdata.membersIndividualTimes
            const currMonth = format(new Date(), "MM")
            const totalDailyTrackedTimes = projectdata.totalDailyTrackedTimes
            const totalDailyTrackedArray = Object.entries(totalDailyTrackedTimes).map(([key, value]) => ({
                date: key,
                value: value
            }))

            const weeklyStats = currentWeekDays.map(date => {
                const formatedDate = formateDateToYMD(date)
                const matchedWeekData = totalDailyTrackedTimes[formatedDate]
                if (matchedWeekData) return formatSecondsToFloatHours(matchedWeekData)
                else return 0
            })

            const monthlyStats = currentMonthDays.map(date => {
                const formatedDate = formateDateToYMD(date)
                const matchedMonthData = totalDailyTrackedTimes[formatedDate]
                if (matchedMonthData) return formatSecondsToFloatHours(matchedMonthData)
                else return 0
            })

            const yearlyStats = currentYearMonths.map(date => {
                let seconds: number = 0
                const month = format(date, "MM")
                const matchedData = totalDailyTrackedArray.filter(track => formatDateToMM(track.date) === month)

                // Is matchedDate lesser than current Date
                if (matchedData.find(track => Number(formatDateToMM(track.date)) <= Number(currMonth))) {
                    matchedData.forEach(track => seconds += track.value)
                    return formatSecondsToFloatHours(seconds)
                } else return null
            })

            const membersStates: { value: number, name: string }[] =
                members.filter(m => membersIndividualTimes[m.userId] !== undefined).map((m: Member) => ({
                    value: formatSecondsToFloatHours(membersIndividualTimes[m.userId].total),
                    name: `${m.name} ${m.surname}`,
                }))

            setProjectTotalTime(projectdata.totalTime)
            setTotalTrackedWeekTimes(weeklyStats)
            setTotalTrackedMonthTimes(monthlyStats)
            setTotalTrackedYearTimes(yearlyStats)
            setMembersStats(membersStates)

        }

        updateData()

    }, [mode, projectId, projectdata, userId, workspaceId])

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
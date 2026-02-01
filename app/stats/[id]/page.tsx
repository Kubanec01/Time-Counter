'use client'


import {useParams} from "next/navigation";
import {LineChart} from "@/app/stats/[id]/components/LineChart";
import {useEffect, useState} from "react";
import {Project} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {getDoc} from "firebase/firestore";
import {format, secondsToHours} from "date-fns";
import {
    getCurrentMonthDays,
    getCurrentWeekDays,
    getCurrentYearMonths,
    getThisMonthTrackedDates,
    getThisWeekTrackedDates, getThisYearTrackedDates,
    timeFormatToHours
} from "@/app/stats/[id]/utils";
import {StatsSectionBody} from "@/app/stats/[id]/components/StatsSectionBody";
import {formateDateToYMD} from "@/features/utilities/date/formateDates";
import {parseTimeStringToSeconds} from "@/features/utilities/time/timeOperations";

export default function StatsHome() {

    const [totalTrackedWeekTimes, setTotalTrackedWeekTimes] = useState<number[]>([]);
    const [totalTrackedMonthTimes, setTotalTrackedMonthTimes] = useState<number[]>([]);
    const [totalTrackedYearTimes, setTotalTrackedYearTimes] = useState<number[]>([]);
    const [chartStats, setChartStats] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    const [currData, setCurrData] = useState<number[]>([]);
    const [activeBtnId, setActiveBtnId] = useState<string>("week");

    // Data
    const chartData: { id: string, title: string, data: number[], stats: string[] }[] = [
        {
            id: "week",
            title: "Days",
            stats: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: totalTrackedWeekTimes
        },
        {
            id: "month",
            title: "Month",
            stats: getCurrentMonthDays.map(d => format(d, "dd")),
            data: totalTrackedMonthTimes
        },
        {
            id: "year",
            title: "Year",
            stats: getCurrentYearMonths.map(d => format(d, "M")),
            data: totalTrackedYearTimes
        },
    ]

    const {mode, workspaceId, userId} = useWorkSpaceContext()
    const params = useParams()
    const projectId = params.id


    useEffect(() => {
        if (!userId) return

        const fetchData = async () => {

            const docRef = getFirestoreTargetRef(userId, mode, workspaceId)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) return
            const data = docSnap.data()
            const project: Project = data.projects.find((p: Project) => p.projectId === projectId)
            const totalTrackedTimes = project.totalTrackedTimes

            const thisWeekData = getThisWeekTrackedDates(totalTrackedTimes)
            const thisMonthData = getThisMonthTrackedDates(totalTrackedTimes)
            const thisYearData = getThisYearTrackedDates(totalTrackedTimes)

            const weekResult = getCurrentWeekDays.map(d => {
                const date = formateDateToYMD(d);
                const item = thisWeekData.find(i => i.date === date)
                return item ? timeFormatToHours(item.time) : timeFormatToHours("0")
            });

            const monthResult = getCurrentMonthDays.map(d => {
                const date = formateDateToYMD(d);
                const item = thisMonthData.find(i => i.date === date)
                return item ? timeFormatToHours(item.time) : timeFormatToHours("0")
            })

            const yearResults = getCurrentYearMonths.map(d => {
                let seconds = 0
                const date = format(d, "MM")
                const items = thisYearData.filter(i => format(i.date, "MM") === date)
                items.forEach(i => seconds = seconds + parseTimeStringToSeconds(i.time))
                return secondsToHours(seconds)
            })

            setTotalTrackedWeekTimes(weekResult)
            setCurrData(weekResult)
            setTotalTrackedMonthTimes(monthResult)
            setTotalTrackedYearTimes(yearResults)
        }

        fetchData()

    }, [mode, projectId, userId, workspaceId])

    return (
        <>
            <section
                className={"w-full flex justify-center"}
            >
                <h1 className={"mt-30"}>
                    Project name {projectId}
                </h1>
            </section>
            {/*Weekly Times*/}
            <StatsSectionBody>
                <div
                    className={"h-full flex-1 text-xl pt-8"}>
                    <h1 className={"font-semibold"}>
                        This are stats for this project.
                    </h1>
                    <p
                        className={"text-base w-[70%] mt-1"}>
                        Here you can see how many total hours you tracked in the project.
                    </p>
                    <div
                        className={"flex gap-2 py-4"}>
                        {chartData.map(i => (
                            <button
                                onClick={() => {
                                    setActiveBtnId(i.id)
                                    setCurrData(i.data)
                                    setChartStats(i.stats)
                                }}
                                key={i.id}
                                className={`${activeBtnId === i.id ? "bg-vibrant-purple-600 text-white" : "bg-transparent text-vibrant-purple-600 font-semibold"}
                                text-sm border border-vibrant-purple-600 px-3 py-1 rounded-full cursor-pointer`}
                            >
                                {i.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div
                    className={"w-[60%] h-full flex justify-end items-center"}>
                    <LineChart
                        yAxisTitle={'Hours'}
                        yAxisData={currData}
                        xAxisData={chartStats}
                    />
                </div>
            </StatsSectionBody>
        </>
    )
}
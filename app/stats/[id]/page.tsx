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

    // Data
    const daysData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthsData = getCurrentMonthDays.map(d => format(d, "dd"))
    const yearData: string[] = getCurrentYearMonths.map(d => format(d, "M"))

    const {mode, workspaceId} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid
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
                        This are stats for the last week.
                    </h1>
                    <p
                        className={"text-base w-[70%] mt-1"}>
                        Here you can see how many total hours you tracked in the project over the past week.
                    </p>
                </div>
                <div
                    className={"w-[60%] h-full flex justify-end items-center"}>
                    <LineChart
                        yAxisTitle={'Hours'}
                        yAxisData={totalTrackedWeekTimes}
                        xAxisData={daysData}
                    />
                </div>
            </StatsSectionBody>
            {/*Monthly Times*/}
            <StatsSectionBody>
                <div
                    className={"h-full flex-1 text-xl pt-8"}>
                    <h1 className={"font-semibold"}>
                        This are stats for the last month.
                    </h1>
                    <p
                        className={"text-base w-[70%] mt-1"}>
                        Here you can see how many total hours you tracked in the project over the past month.
                    </p>
                </div>
                <div
                    className={"w-[60%] h-full flex justify-end items-center"}>
                    <LineChart
                        yAxisTitle={'Hours'}
                        yAxisData={totalTrackedMonthTimes}
                        xAxisData={monthsData}
                    />
                </div>
            </StatsSectionBody>
            <StatsSectionBody>
                <div
                    className={"h-full flex-1 text-xl pt-8"}>
                    <h1 className={"font-semibold"}>
                        This are stats for the last year.
                    </h1>
                    <p
                        className={"text-base w-[70%] mt-1"}>
                        Here you can see how many total hours you tracked in the project over the past year.
                    </p>
                </div>
                <div
                    className={"w-[60%] h-full flex justify-end items-center"}>
                    <LineChart
                        yAxisTitle={'Hours'}
                        yAxisData={totalTrackedYearTimes}
                        xAxisData={yearData}
                    />
                </div>
            </StatsSectionBody>
        </>
    )
}
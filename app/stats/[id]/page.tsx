'use client'

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Member, Project} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {doc, getDoc} from "firebase/firestore";
import {format} from "date-fns";
import {
    getCurrentMonthDays,
    getCurrentWeekDays,
    getCurrentYearMonths,
    getThisMonthTrackedDates,
    getThisWeekTrackedDates, getThisYearTrackedDates,
} from "@/app/stats/[id]/utils";
import {formateDateToYMD} from "@/features/utilities/date/formateDates";
import {FullTrackedTimeChart} from "@/app/stats/[id]/components/chartsSections/FullTrackedTimeChart";
import {EveryUserTotalTimePieChart} from "@/app/stats/[id]/components/chartsSections/EveryUserTotalTimePieChart";
import {ProjectTimeProgres} from "@/app/stats/[id]/components/chartsSections/ProjectTimeProgres";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";
import {secondsToFloatHours} from "@/features/utilities/time/timeOperations";

export default function StatsHome() {

    const [totalTrackedWeekTimes, setTotalTrackedWeekTimes] = useState<number[]>([]);
    const [totalTrackedMonthTimes, setTotalTrackedMonthTimes] = useState<number[]>([]);
    const [totalTrackedYearTimes, setTotalTrackedYearTimes] = useState<number[]>([]);
    const [membersStats, setMembersStats] = useState<{ value: number, name: string }[]>([]);


    const {mode, workspaceId, userId} = useWorkSpaceContext()
    const params = useParams()
    const projectId = params.id


    useEffect(() => {
        if (!userId) return

        const fetchData = async () => {

            const docRef = doc(db, "realms", workspaceId)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) return console.error(documentNotFound)
            const data = docSnap.data()
            const project: Project = data.projects.find((p: Project) => p.projectId === projectId)
            const totalTrackedTimes = project.totalTrackedTimes

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

            const yearResults = getCurrentYearMonths.map(d => {
                let hours = 0
                const date = format(d, "MM")
                const items = thisYearData.filter(i => format(i.date, "MM") === date)
                items.forEach(i => hours += secondsToFloatHours(i.time))
                return hours
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
            <section
                className={"w-full flex justify-center"}
            >
                <h1 className={"mt-30"}>
                    Project name {projectId}
                </h1>
            </section>
            {/*Weekly Times*/}
            <FullTrackedTimeChart
                totalTrackedWeekTimes={totalTrackedWeekTimes}
                totalTrackedMonthTimes={totalTrackedMonthTimes}
                totalTrackedYearTimes={totalTrackedYearTimes}
            />
            <EveryUserTotalTimePieChart
                membersStats={membersStats}
            />
            <ProjectTimeProgres
                totalTrackedYearTimes={totalTrackedYearTimes}
            />
        </>
    )
}
'use client'

import {getCurrentMonthDays, getCurrentYearMonths} from "@/app/stats/[id]/utils";
import {format} from "date-fns";
import {StatsSectionBody} from "@/app/stats/[id]/components/StatsSectionBody";
import {LineChart} from "@/app/stats/[id]/components/LineChart";
import {useEffect, useState} from "react";


type FullTrackedTimeChartProps = {
    totalTrackedWeekTimes: number[],
    totalTrackedMonthTimes: number[],
    totalTrackedYearTimes: number[],
}

export const FullTrackedTimeChart = ({...props}: FullTrackedTimeChartProps) => {

    const [activeBtnId, setActiveBtnId] = useState<string>("week");
    const [currData, setCurrData] = useState<number[]>([]);
    const [chartStats, setChartStats] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

    // Data
    const chartData: { id: string, title: string, data: number[], stats: string[] }[] = [
        {
            id: "week",
            title: "Week",
            stats: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: props.totalTrackedWeekTimes
        },
        {
            id: "month",
            title: "Month",
            stats: getCurrentMonthDays.map(d => format(d, "dd")),
            data: props.totalTrackedMonthTimes
        },
        {
            id: "year",
            title: "Year",
            stats: getCurrentYearMonths.map(d => format(d, "M")),
            data: props.totalTrackedYearTimes
        },
    ]

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrData(props.totalTrackedWeekTimes);
    }, [props.totalTrackedWeekTimes])

    return (
        <>
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
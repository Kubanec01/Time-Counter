'use client'

import {format} from "date-fns";
import {useEffect, useState} from "react";
import {StatsSectionBody} from "@/app/workspaces/settings/project/stats/[id]/components/StatsSectionBody";
import {getCurrentMonthDays, getCurrentYearMonths} from "@/app/workspaces/settings/project/stats/[id]/features/utils";
import {LineChart} from "@/app/workspaces/settings/project/stats/[id]/components/chartsTemplates/LineChart";


type FullTrackedTimeChartProps = {
    totalTrackedWeekTimes: number[],
    totalTrackedMonthTimes: number[],
    totalTrackedYearTimes: number[],
}

export const FullTrackedTimeChart = ({...props}: FullTrackedTimeChartProps) => {

    const [filteredPeriod, setFilteredPeriod] = useState<string>("week");
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
            <div
                className={"border h-[286] rounded-xl p-4"}
            >
                <div
                    className={"w-full flex justify-between "}>
                    <div>
                        <h1>Total time</h1>
                        <p>
                            {"00:00:00"}
                        </p>
                    </div>
                    <select>

                    </select>
                </div>
                <div
                    className={"w-full"}>
                    <LineChart
                        yAxisTitle={'Hours'}
                        yAxisData={currData}
                        xAxisData={chartStats}
                    />
                </div>
            </div>
        </>
    )
}
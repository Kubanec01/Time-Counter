'use client'

import {format} from "date-fns";
import {useEffect, useState} from "react";
import {getCurrentMonthDays, getCurrentYearMonths} from "@/app/workspaces/settings/project/stats/[id]/features/utils";
import {LineChart} from "@/app/workspaces/settings/project/stats/[id]/components/chartsTemplates/LineChart";
import {
    SelectDataFilterButton
} from "@/app/workspaces/settings/project/stats/[id]/components/chartsSections/fullTrackedTimeChart/components/SelectDataFilterButton";


type FullTrackedTimeChartProps = {
    totalTrackedWeekTimes: number[],
    totalTrackedMonthTimes: number[],
    totalTrackedYearTimes: (number | null)[],
}

export const FullTrackedTimeChart = ({...props}: FullTrackedTimeChartProps) => {

    const [currData, setCurrData] = useState<(number | null)[]>([]);
    const [chartStats, setChartStats] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

    const updateFilteredPeriod = (value: "week" | "month" | "year") => {
        if (value === "week") {
            setCurrData(props.totalTrackedWeekTimes)
            setChartStats(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
        } else if (value === "month") {
            setCurrData(props.totalTrackedMonthTimes)
            setChartStats(getCurrentMonthDays.map(d => format(d, "dd")))
        } else {
            setCurrData(props.totalTrackedYearTimes)
            setChartStats(getCurrentYearMonths.map(d => format(d, "M")))
        }

    }

    const totalPeriodHours = currData.reduce((a, b) => (a ?? 0) + (b ?? 0), 0)


    // Data
    const filteredPeriodOptions: { value: string, title: string }[] = [
        {
            value: "week",
            title: "Week",
        },
        {
            value: "month",
            title: "Month",
        },
        {
            value: "year",
            title: "Year",
        },

    ]

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrData(props.totalTrackedWeekTimes);
    }, [props.totalTrackedWeekTimes])

    return (
        <>
            <div
                className={"bg-white flex flex-col items-center justify-between rounded-xl p-4 border border-black/15"}
            >
                <div
                    className={"w-full flex justify-between "}>
                    <div>
                        <h1
                            className={"text-sm text-black/60 font-medium"}>
                            Total time</h1>
                        <p
                            className={"text-2xl mt-0.5"}>
                            {totalPeriodHours} h
                        </p>
                    </div>
                    <SelectDataFilterButton
                        options={filteredPeriodOptions}
                        updateFilter={(v) => updateFilteredPeriod(v)}
                    />
                </div>
                <div
                    className={"flex-1 w-full flex items-center justify-center pt-3 pr-2"}>
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
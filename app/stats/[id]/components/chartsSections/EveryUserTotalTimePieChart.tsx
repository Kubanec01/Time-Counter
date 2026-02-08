'use client'

import {StatsSectionBody} from "@/app/stats/[id]/components/StatsSectionBody";
import {PieChart} from "@/app/stats/[id]/components/PieChart";


type PieChartProps = {
    membersStats: { value: number, name: string }[]
}

export const EveryUserTotalTimePieChart = ({...props}: PieChartProps) => {

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
                </div>
                <div
                    className={"w-[60%] h-full flex justify-end items-center"}>
                    <PieChart
                        data={props.membersStats}
                    />
                </div>
            </StatsSectionBody>
        </>
    )
}
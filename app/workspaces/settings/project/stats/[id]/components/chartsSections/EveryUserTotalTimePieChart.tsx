'use client'


import {PieChart} from "@/app/workspaces/settings/project/stats/[id]/components/chartsTemplates/PieChart";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";


type PieChartProps = {
    membersStats: { value: number, name: string }[]
    projectTotalTimeValue: number
}

export const EveryUserTotalTimePieChart = ({...props}: PieChartProps) => {

    const totalTime = formatSecondsToTimeString(props.projectTotalTimeValue as number)

    return (
        <>
            <div
                className={"bg-white rounded-xl row-span-2 p-4 flex flex-col border border-black/15"}>
                {/* Pie data */}
                <section
                    className={"h-[64%] flex flex-col items-center justify-between border-b border-black/20"}>
                    <div
                        className={"w-full"}>
                        <h1
                            className={"text-sm text-black/60 font-medium"}>
                            Users individual time</h1>
                        <p
                            className={"text-xs text-black/50 w-[75%] mt-1"}>
                            View the tracked time of each user and understand their activity across projects.</p>
                    </div>
                    <div
                        className={"h-[50%] mt-2 w-full flex flex-col items-center justify-center"}>
                        <PieChart
                            data={props.membersStats}
                        />
                    </div>
                    <div
                        className={"w-full mb-2"}>
                        <h1
                            className={"text-sm text-black/60"}>
                            Total time</h1>
                        <p
                            className={"text-xl"}>
                            {totalTime}
                        </p>
                    </div>
                </section>
                {/*  Most active members  */}
                <section
                    className={"w-full flex flex-1 flex-col items-start pt-3"}>
                    <h1
                        className={"text-black/60 text-[15px]"}>
                        Most active users
                    </h1>
                    <div
                        className={"w-full flex-1 flex justify-center items-center"}>
                        <h1
                            className={"text-sm text-black/40 -mt-4"}>
                            No data found :/
                        </h1>
                    </div>
                </section>
            </div>
        </>
    )
}
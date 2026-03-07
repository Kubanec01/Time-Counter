import {format} from "date-fns";
import {getCurrentYearMonths} from "@/app/workspaces/settings/project/stats/[id]/features/utils";
import {AreaChart} from "@/app/workspaces/settings/project/stats/[id]/components/chartsTemplates/AreaChart";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";

type ProjectTimeProgresProps = {
    totalTrackedYearTimes: (number | null)[],
    projectTotalTimeValue: number
}

export const ProjectTimeProgres = ({...props}: ProjectTimeProgresProps) => {

    const data = {
        stats: getCurrentYearMonths.map(d => format(d, "M")),
        data: props.totalTrackedYearTimes
    }

    const totalTime = formatSecondsToTimeString(props.projectTotalTimeValue)

    return (
        <div
            className={"bg-white rounded-xl col-span-2 p-4 flex flex-col"}>
            <div
                className={"w-full"}>
                <h1
                    className={"text-sm text-black/60 font-medium"}>
                    Long-term tracking progres
                </h1>
                <p
                    className={"text-2xl mt-1"}>
                    {totalTime}
                </p>
            </div>
            <div
                className={"flex-1 pt-4 pr-4"}>
                <AreaChart
                    yAxisData={data.data}
                    xAxisData={data.stats}
                />
            </div>
        </div>
    )
}
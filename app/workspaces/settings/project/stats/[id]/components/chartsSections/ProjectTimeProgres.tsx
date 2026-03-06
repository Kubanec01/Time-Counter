import {format} from "date-fns";
import {StatsSectionBody} from "@/app/workspaces/settings/project/stats/[id]/components/StatsSectionBody";
import {getCurrentYearMonths} from "@/app/workspaces/settings/project/stats/[id]/features/utils";
import {AreaChart} from "@/app/workspaces/settings/project/stats/[id]/components/chartsTemplates/AreaChart";

type ProjectTimeProgresProps = {
    totalTrackedYearTimes: number[],

}

export const ProjectTimeProgres = ({...props}: ProjectTimeProgresProps) => {

    const data = {
        stats: getCurrentYearMonths.map(d => format(d, "M")),
        data: props.totalTrackedYearTimes
    }


    return (
        <StatsSectionBody>
            <div
                className={"h-full flex-1 text-xl pt-8"}>
                <h1 className={"font-semibold"}>
                    This are stats for this project.
                </h1>
                <p
                    className={"text-base w-[70%] mt-1"}>
                    Here you can see how many total progres in the project per year.
                </p>
            </div>
            <div
                className={"w-[60%] h-full flex justify-end items-center"}>
                <AreaChart
                    yAxisData={data.data}
                    xAxisData={data.stats}
                />
            </div>
        </StatsSectionBody>
    )
}
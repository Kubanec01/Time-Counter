import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";
import {Section} from "@/types";
import {currentYearMonths} from "@/app/workspaces/settings/project/stats/[id]/features/utils";
import {formatDateToMM, formatSecondsToFloatHours} from "@/features/utilities/time/timeOperations";
import {AreaChart} from "@/app/workspaces/settings/project/stats/[id]/components/chartsTemplates/AreaChart";
import {format} from "date-fns";


type UserTimesPerYearChartProps = {
    workspaceData: DocumentData
    userId: string | undefined
}

const UserTimesPerYearsChart = ({...props}: UserTimesPerYearChartProps) => {

    const [trackedHoursPerYear, setTrackedHoursPerYear] = useState<number[]>([])

    const chartMonths = currentYearMonths.map(date => format(date, "M"))


    useEffect(() => {
        if (!props.userId) return

        const projectsSections: Section[] = props.workspaceData.projectsSections || []
        const filteredSections: Section[] = projectsSections.filter((section: Section) => section.userId === props.userId)

        const trackedHoursArr = currentYearMonths.map(date => {
            let seconds = 0
            const formatedDate = formatDateToMM(date)
            filteredSections.forEach(section => {
                if (format(section.updateDate, "MM") === formatedDate) seconds += section.time
            })
            return formatSecondsToFloatHours(seconds)
        })

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTrackedHoursPerYear(trackedHoursArr)
    }, [props.userId, props.workspaceData.projectsSections])


    return (
        <div
            className={"w-full h-[130px]"}
        >
            <AreaChart
                yAxisData={trackedHoursPerYear}
                xAxisData={chartMonths}
            />
        </div>
    )
}

export default UserTimesPerYearsChart
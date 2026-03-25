'use client'


import {useEffect, useState} from "react";
import {useProjectData} from "@/features/hooks/useProjectData";
import {currentWeekDays} from "@/app/workspaces/settings/project/stats/[id]/features/utils";
import {formateDateToYMD} from "@/features/utilities/date/dateOperations";
import {formatSecondsToFloatHours} from "@/features/utilities/time/timeOperations";
import {twMerge} from "tailwind-merge";

type MaxTrackingTimeIndicatorProps = {
    userId: string | undefined;
    workspaceId: string
    projectId: string
    formatedDateToYMD: string
    bodyClassname?: string
    labelClassname?: string
}


const MaxTrackingTimeIndicator = ({...props}: MaxTrackingTimeIndicatorProps) => {

    // States
    const [isDataLoading, setIsDataLoading] = useState(false)
    const [maxTrackingTime, setMaxTrackingTime] = useState<number>(0)
    const [usersTrackedTime, setUsersTrackedTime] = useState<number>(0)

    // Hooks
    const projectData = useProjectData(props.workspaceId, props.projectId)

    const bodyClass = "flex items-center h-full"
    const labelClassname = `${isDataLoading ? "hidden" : "flex"} text-base text-black/50 font-medium`

    useEffect(() => {

        const updateData = async () => {
            if (!props.userId || !projectData) return

            setIsDataLoading(true)

            const maxDailyTrackingTime = projectData.dailyMaxTrackTime
            const maxWeeklyTrackingTime = projectData.weeklyMaxTrackTime
            const usersTrackedTimes = projectData.membersIndividualTimes[props.userId]

            if (!usersTrackedTimes) {
                setUsersTrackedTime(0)
                if (maxDailyTrackingTime > 0) setMaxTrackingTime(maxDailyTrackingTime)
                else setMaxTrackingTime(maxWeeklyTrackingTime)
                setIsDataLoading(false)
                return
            }

            if (maxDailyTrackingTime > 0) {
                const usersTimeValue = usersTrackedTimes.daily[props.formatedDateToYMD]
                setMaxTrackingTime(maxDailyTrackingTime)
                if (usersTimeValue) setUsersTrackedTime(usersTimeValue)
                else setUsersTrackedTime(0)
            } else {
                let usersWeeklyTrackedValue = 0

                const usersTrackedTimesArr = Object.entries(usersTrackedTimes.daily).map(([key, value]) => ({
                    date: key,
                    time: value
                }))

                currentWeekDays.forEach(date => {
                    const formatedDate = formateDateToYMD(date)
                    const matchedUsersDay = usersTrackedTimesArr.find(track => track.date === formatedDate)
                    if (matchedUsersDay) usersWeeklyTrackedValue += matchedUsersDay.time as number
                })

                setMaxTrackingTime(maxWeeklyTrackingTime)
                setUsersTrackedTime(usersWeeklyTrackedValue)
            }

            setIsDataLoading(false)
        }

        updateData()
    }, [projectData, props.formatedDateToYMD, props.userId])

    return (
        <div
            className={twMerge(bodyClass, props.bodyClassname)}
        >
            <h1
                className={`${isDataLoading ? "block" : "hidden"} text-sm text-black/50`}
            >
                Loading Data...
            </h1>
            <div
                className={twMerge(labelClassname, props.labelClassname)}
            >
                <p
                    className={`${usersTrackedTime === maxTrackingTime ? "text-vibrant-purple-700" : ""} ${usersTrackedTime > maxTrackingTime ? "text-red-400" : ""}`}
                >
                    {formatSecondsToFloatHours(usersTrackedTime)}
                </p>
                <p>/</p>
                <p>
                    {formatSecondsToFloatHours(maxTrackingTime)}
                </p>
            </div>
        </div>
    )
}


export default MaxTrackingTimeIndicator
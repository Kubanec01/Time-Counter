'use client'

import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";
import {Section} from "@/types";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";

type TotalUsersTrackedTimeProps = {
    userId: string
    workspaceData: DocumentData
}

const TotalUsersTrackedTime = ({...props}: TotalUsersTrackedTimeProps) => {

    const [totalTime, setTotalTime] = useState(0)


    useEffect(() => {

        const fetchData = async () => {

            const sections = props.workspaceData.projectsSections || []

            const matchedSections: Section[] = sections.filter((section: Section) => section.userId === props.userId)

            let totalTime = 0

            matchedSections.forEach(section => totalTime += section.time)
            setTotalTime(totalTime)
        }

        fetchData().catch(err => console.log(err))

    }, [props.userId, props.workspaceData.projectsSections])


    return (
        <div
            className={"bg-vibrant-purple-300/40 border border-vibrant-purple-300 mx-auto w-[94%] p-2 rounded-lg"}
        >
            <h1
                className={"text-xs font-medium py-1 text-black/50"}
            >
                Total time
            </h1>
            <p
                className={"text-xl font-semibold text-vibrant-purple-600"}
            >
                {formatSecondsToTimeString(totalTime)}
            </p>
        </div>
    )

}

export default TotalUsersTrackedTime
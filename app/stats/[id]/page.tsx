'use client'


import {useParams} from "next/navigation";
import {LineChart} from "@/app/stats/[id]/components/LineChart";
import {useEffect, useState} from "react";
import {Project} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {getDoc} from "firebase/firestore";
import {format} from "date-fns";
import {getCurrentWeekDays, getThisWeekTRackedDates, timeFormatToHours} from "@/app/stats/[id]/utils";

export default function StatsHome() {

    const [totalTrackedTimes, setTotalTrackedTimes] = useState<number[]>([]);

    // Data
    const daysData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const {mode, workspaceId} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const params = useParams()
    const projectId = params.id


    useEffect(() => {
        if (!userId) return

        const fetchData = async () => {

            const docRef = getFirestoreTargetRef(userId, mode, workspaceId)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) return
            const data = docSnap.data()
            const project: Project = data.projects.find((p: Project) => p.projectId === projectId)
            const totalTrackedTimes = project.totalTrackedTimes

            const thisWeekData = getThisWeekTRackedDates(totalTrackedTimes)

            const result = getCurrentWeekDays.map(d => {
                const date = format(d, "yyyy-MM-dd");
                const item = thisWeekData.find(i => i.date === date)
                return item ? item.time : "0"
            });

            setTotalTrackedTimes(result.map(t => timeFormatToHours(t)))
        }

        fetchData()

    }, [mode, projectId, userId, workspaceId])

    return (
        <>
            <section
                className={"w-full flex justify-center"}
            >
                <h1 className={"mt-30"}>
                    Project name {projectId}
                </h1>
            </section>
            <section
                className={"w-[90%] max-w-[1000px] h-[340px] p-10 mt-30 rounded-xl shadow-lg mx-auto flex justify-between items-center bg-white/60"}>
                <div
                    className={"h-full flex-1 text-xl pt-8"}>
                    <h1 className={"font-semibold"}>
                        This are stats for the last week.
                    </h1>
                    <p
                        className={"text-base w-[70%] mt-1"}>
                        Here you can see how many total hours you tracked in the project over the past week.
                    </p>
                </div>
                <div
                    className={"w-[60%] h-full flex justify-end items-center"}>
                    <LineChart
                        yAxisTitle={'Hours'}
                        yAxisData={totalTrackedTimes}
                        xAxisData={daysData}
                    />
                </div>
            </section>
        </>
    )
}
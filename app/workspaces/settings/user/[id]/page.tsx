'use client'


import {useParams} from "next/navigation";
import {useMemberData} from "@/features/hooks/useMemberData";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import TitleBar from "@/app/workspaces/settings/user/components/TitleBar";
import {LoadingPage} from "@/app/LoadingPage/LoadingPage";
import UserInfo from "@/app/workspaces/settings/user/components/UserInfo";
import {useWorkspaceData} from "@/features/hooks/useWorkspaceData";
import UserTimesPerYearsChart from "@/app/workspaces/settings/user/components/UserTimesPerYearsChart";
import ProjectsList from "@/app/workspaces/settings/user/components/ProjectsList";
import SettingsList from "@/app/workspaces/settings/user/components/SettingsList";
import TotalUsersTrackedTime from "@/app/workspaces/settings/user/components/TotalUsersTrackedTime";

export default function UserPage() {

    const userId = useParams().id as string
    const {workspaceId} = useWorkSpaceContext()
    const userData = useMemberData(workspaceId, userId)
    const workspaceData = useWorkspaceData(workspaceId)

    if (!userData || !workspaceData) return <LoadingPage/>

    const userFullname = userData ? `${userData.name} ${userData.surname}` : ""

    return (
        <>
            <div
                className={"flex shadow-xl border border-black/6 fixed top-2/4 left-2/4 -translate-2/4 gap-0.5 bg-black/10 w-11/12 overflow-hidden rounded-2xl max-w-small"}
            >
                <section
                    className={"relative bg-white rounded-l-2xl overflow-hidden h-full w-[70%] pb-4"}
                >
                    <TitleBar
                        className={"absolute w-full top-0 left-0 z-20 pl-5"}
                        title={userFullname}
                    />
                    <UserInfo
                        userData={userData}
                    />
                    <div
                        className={"flex mt-4"}
                    >
                        {/* Progres Chart */}
                        <div
                            className={"w-[90%] mx-auto border-t border-b border-black/14 py-4"}
                        >
                            <h1
                                className={"text-xs font-medium text-black/64 pb-4"}
                            >
                                Yearly overview - tracked hours
                            </h1>
                            <UserTimesPerYearsChart
                                workspaceData={workspaceData}
                                userId={userId}
                            />
                        </div>
                    </div>
                    <div
                        className={"w-[90%] mx-auto pt-4"}
                    >
                        <SettingsList/>
                    </div>
                </section>
                <section
                    className={"w-[30%] bg-white relative rounded-r-2xl overflow-hidden flex flex-col justify-between pb-4"}
                >
                    <TitleBar
                        className={"absolute text-3xl pl-4 w-full top-0 left-0 z-20 text-white/94"}
                        title={'Projects'}
                    />
                    <div
                        className={"mt-30"}
                    >
                        <ProjectsList
                            workspaceId={workspaceId}
                            userId={userId}
                            workspaceData={workspaceData}
                        />
                    </div>
                    <TotalUsersTrackedTime
                        userId={userId}
                        workspaceData={workspaceData}
                    />
                </section>
            </div>
        </>
    )
}
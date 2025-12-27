'use client'

import {useState} from "react";
import {JoinWorkspace} from "@/app/workplaces/components/JoinWorkspace";
import {CreateWorkspace} from "@/app/workplaces/components/CreateWorkspace";
import backgroundImg from "@/public/background_forest_img.jpg"
import backgroundImg2 from "@/public/background_team_img.jpg"

const WorkPlacesPage = () => {

    const [workspaceAction, setWorkspaceAction] = useState<"create" | "join">("join")

    return (
        <section
            style={{
                backgroundImage: `url(${backgroundImg2.src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
            className={"w-full h-screen flex flex-col justify-center items-center gap-10"}>
            <div
                className={"flex flex-col justify-center items-center bg-white/30 backdrop-blur-xl border-white/50 border shadow-lg ease-in px-12 rounded-2xl py-8 gap-10"}
            >

                {
                    workspaceAction === "join"
                        ?
                        <JoinWorkspace/>
                        :
                        <CreateWorkspace/>
                }
                <button
                    onClick={() => setWorkspaceAction(prev => prev === "join" ? "create" : "join")}
                    className={"cursor-pointer text-sm px-6 py-2.5 rounded-[100px] bg-black/35 text-white hover:scale-105 active:scale-95 duration-100 ease-in"}>
                    {workspaceAction === "join" ? "I want to create workspace >" : "I want to join the workspace >"}
                </button>
            </div>
        </section>
    )
}

export default WorkPlacesPage
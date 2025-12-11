'use client'

import {useState} from "react";
import {JoinWorkspace} from "@/app/workplaces/components/JoinWorkspace";
import {CreateWorkspace} from "@/app/workplaces/components/CreateWorkspace";

const WorkPlacesPage = () => {

    const [workspaceAction, setWorkspaceAction] = useState<"create" | "join">("join")

    return (
        <section
            className={"w-full h-screen flex flex-col justify-center items-center gap-10"}>
            {
                workspaceAction === "join"
                    ?
                    <JoinWorkspace/>
                    :
                    <CreateWorkspace/>
            }
            <button
                onClick={() => setWorkspaceAction(prev => prev === "join" ? "create" : "join")}
                className={"cursor-pointer border px-6 py-3 rounded-[100px]"}>
                {workspaceAction === "join" ? "I want to create workspace >" : "I want to join the workspace >"}
            </button>
        </section>
    )
}

export default WorkPlacesPage
'use client'

import {useState} from "react";
import {WorkspaceForm} from "@/app/workspaces/workspaceLoginSection/WorkspaceForm";


export const WorkspacesLoginSection = () => {

    const [workspaceAction, setWorkspaceAction] = useState<"create" | "join">("create")


    return (
        <>
            {/* Buttons */}
            <div
                className={"my-10 flex items-center justify-center gap-20"}>
                <button
                    onClick={() => setWorkspaceAction("create")}
                    className={`${workspaceAction === "create" ? "text-black" : "text-black/40"}
                    font-semibold cursor-pointer`}
                >
                    Create Workspace
                </button>
                <button
                    onClick={() => setWorkspaceAction("join")}
                    className={`${workspaceAction === "join" ? "text-black" : "text-black/40"}
                    font-semibold cursor-pointer`}
                >
                    Join Workspace
                </button>
            </div>
            <WorkspaceForm
                workspaceAction={workspaceAction}
            />
        </>
    )
}
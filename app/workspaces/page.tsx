'use client'

import {Hero} from "@/app/workspaces/workspaceLoginSection/Hero";
import {WorkspacesLoginSection} from "@/app/workspaces/workspaceLoginSection/WorkspacesLoginSection";

export default function WorkspacesPage() {

    return (
        <section
            className={"w-full h-screen bg-radial from-gradient-yellow from-5% to-cloud-white to-50%"}>
            <Hero/>
            <WorkspacesLoginSection/>
        </section>
    )
}

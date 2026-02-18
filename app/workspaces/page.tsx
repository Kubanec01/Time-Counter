'use client'

import {Hero} from "@/app/workspaces/components/Hero";
import {WorkspacesLoginSection} from "@/app/workspaces/components/workspaceLoginSection/WorkspacesLoginSection";

export default function WorkspacesPage() {

    return (
        <section
            className={"w-full h-screen overflow-hidden" +
                " bg-radial from-gradient-yellow from-5% to-cloud-white to-50%"}>
            <Hero/>
            <WorkspacesLoginSection/>
        </section>
    )
}

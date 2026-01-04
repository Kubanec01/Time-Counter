import {ReactNode} from "react";


export default function WorkspaceSettingsLayout({children}: { children: ReactNode }) {

    return (
        <div className="min-h-screen bg-black/90 flex">
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

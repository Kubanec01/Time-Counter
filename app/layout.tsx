import "./globals.css";
import {ClockTimeContextProvider} from "@/features/contexts/clockCountContext";
import {WorkSpaceContextProvider} from "@/features/contexts/workspaceContext";
import React from "react";
import {Metadata} from "next";
import {useMounted} from "@/features/hooks/useMounted";

export const metadata: Metadata = {
    formatDetection: {
        telephone: false,
        date: false,
        email: false,
        address: false,
    },
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
        <body>
        <WorkSpaceContextProvider>
            <ClockTimeContextProvider>
                {children}
            </ClockTimeContextProvider>
        </WorkSpaceContextProvider>
        </body>
        </html>
    );
}

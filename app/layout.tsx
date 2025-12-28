import "./globals.css";
import {ClockTimeContextProvider} from "@/features/contexts/clockCountContext";
import {WorkSpaceContextProvider} from "@/features/contexts/workspaceContext";
import React from "react";
import {Metadata} from "next";
import Navbar from "@/components/mainNavbar/Navbar";

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
                <Navbar/>
                {children}
            </ClockTimeContextProvider>
        </WorkSpaceContextProvider>
        </body>
        </html>
    );
}

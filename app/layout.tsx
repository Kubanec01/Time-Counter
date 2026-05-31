import "./globals.css";
import {ClockTimeContextProvider} from "@/features/hooks/context/clockCountContext";
import {WorkSpaceContextProvider} from "@/features/hooks/context/workspaceContext";
import React from "react";
import {Metadata} from "next";
import Navbar from "@/components/mainNavbar/Navbar";
import {Inter} from "next/font/google"
import {ErrorBannerContextProvider} from "@/features/hooks/context/useErrorBannerContext";
import ErrorBannerModal from "@/components/modals01/ErrorBunderModal/ErrorBannerModal";

const inter = Inter({
    subsets: ["latin", "latin-ext"],
});

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
        <body className={`${inter.className} font-sans`}>
        <ErrorBannerContextProvider>
            <WorkSpaceContextProvider>
                <ClockTimeContextProvider>
                    <Navbar/>
                    <ErrorBannerModal/>
                    {children}
                </ClockTimeContextProvider>
            </WorkSpaceContextProvider>
        </ErrorBannerContextProvider>
        </body>
        </html>
    );
}

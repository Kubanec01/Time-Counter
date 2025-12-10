import "./globals.css";
import {ClockTimeContextProvider} from "@/features/contexts/clockCountContext";
import {WorkSpaceContextProvider} from "@/features/contexts/workspaceContext";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
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

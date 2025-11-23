import "./globals.css";
import {ClockTimeContextProvider} from "@/features/contexts/clockCountContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <ClockTimeContextProvider>
            <Navbar/>
            {children}
        </ClockTimeContextProvider>
        </body>
        </html>
    );
}

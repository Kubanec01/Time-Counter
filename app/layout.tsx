import "./globals.css";
import {ClockTimeContextProvider} from "@/features/contexts/clockCountContext";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <ClockTimeContextProvider>
            {children}
        </ClockTimeContextProvider>
        </body>
        </html>
    );
}

import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import Link from "next/link";

export default function Custom404() {

    return (
        <section
            className={"w-full flex justify-center items-center h-screen bg-gray-300 z-[2000] relative"}>
            <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-xl text-black/40">
                    Error
                </p>
                <h1 className="text-9xl font-semibold text-white/25">
                    404
                </h1>
                <h2 className="text-black/50 text-center max-w-md">
                    Sorry, the page was not found or is still under construction.
                </h2>
                <Link
                    href={"/"}
                    className="main-button text-white px-4 py-1 rounded-lg mt-4">
                    Go Home
                </Link>
            </div>
        </section>
    )
}
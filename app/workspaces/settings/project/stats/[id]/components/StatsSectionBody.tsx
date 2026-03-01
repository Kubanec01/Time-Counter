import {ReactNode} from "react";


export const StatsSectionBody = ({children}: { children: ReactNode }) => {
    return (
        <section
            className={"w-[90%] max-w-[1000px] h-[340px] p-10 mt-14 rounded-xl shadow-lg mx-auto flex justify-between items-center bg-white/80"}>
            {children}
        </section>
    )
}
import {twMerge} from "tailwind-merge";

const TitleBar = ({title, className}: { title: string, className?: string }) => {

    return (
        <div
            className={twMerge("h-26 bg-linear-to-tr from-vibrant-purple-500 to-vibrant-purple-400/80 flex" +
                " items-end pl-2 pb-0.5 text-6xl text-white/54 font-medium", className)}
        >
            {title}
        </div>
    )
}


export default TitleBar
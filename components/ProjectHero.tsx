type HeroProps = {
    projectSpec: "Logging" | "Tracking"
    projectName: string
}

export const ProjectHero = ({...props}: HeroProps) => {


    return (
        <div
            className={"w-11/12 mx-auto text-center mt-[140px]"}>
            <p
                className={"text-sm font-semibold text-vibrant-purple-700"}>
                {props.projectSpec}
            </p>
            <h1
                className={"text-3xl font-semibold mt-2 text-black/80"}>
                Now working on {props.projectName}
            </h1>
        </div>
    )
}
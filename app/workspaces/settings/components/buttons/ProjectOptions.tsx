import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {ProjectOption} from "@/types";
import {updateProjectOptions} from "@/features/utilities/updateProjectOption";


type ProjectOptionsProps = {
    projectOptions: ProjectOption[],
    projectId: string,
    workspaceId: string,
}

export const ProjectOptions = ({...props}: ProjectOptionsProps) => {

    const {replace} = useReplaceRouteLink()


    return (
        <div
            className={"border-b border-black/20 py-4"}>
            <div>
                <h1
                    className={"text-[22px] font-medium"}>
                    Project options
                </h1>
                <p
                    className={"font-medium text-xs text-black/50 w-[70%] mt-1"}>
                    You can choose which basic options you want to have active. To activate or deactivate an option,
                    simply click on it.
                    These are general project options. If you want to assign specific options to individual users, you
                    can do so in the <button
                    onClick={() => replace('/workspaces/users')}
                    className={"text-vibrant-purple-700 font-semibold underline cursor-pointer"}>users</button> settings.
                </p>
            </div>
            <ul
                className={"flex flex-wrap items-center gap-5 w-[84%] mt-7"}>
                {props.projectOptions.map(o => (
                    <li
                        key={o.value}
                        onClick={() => updateProjectOptions(props.workspaceId, props.projectId, o)}
                        className={`${o.active ? "" : "border-black/20 text-black/20 hover:text-black hover:border-black duration-150"}
                        text-sm px-4 py-0.5 font-medium border rounded-full cursor-pointer`}
                    >
                        {o.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}
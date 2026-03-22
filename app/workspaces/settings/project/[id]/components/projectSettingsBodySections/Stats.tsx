import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";
import {useParams} from "next/navigation";


export const Stats = () => {

    const projectId = useParams().id

    return (
        <NavButton
            bulletPoint={'inactive'}
            id={'project-stats'}
            title={'Project Stats'}
            specSubtitle={"In the Project Stats, you can see the recorded time of all users in hours across different time periods. Improve your overview, productivity, and efficiency."}
            navLink={`/workspaces/settings/project/stats/${projectId}`}
        />
    )
}

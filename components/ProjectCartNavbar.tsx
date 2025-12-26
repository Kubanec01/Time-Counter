import {useRouter} from "next/navigation";
import {useClockTimeContext} from "@/features/contexts/clockCountContext";
import {useState} from "react";
import InformativeModal from "@/components/modals/InformativeModal";


const ProjectCartNavbar = ({projectName}: { projectName: string | null }) => {

    // state
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // Navigate Routing
    const router = useRouter()
    const {isClocktimeRunning} = useClockTimeContext()

    const goToHomePage = () => {
        if (isClocktimeRunning) setIsInfoModalOpen(true);
        else router.replace("/");
    }

    return (
        <div
            className={`w-full fixed top-0 left-0 h-[72px] bg-black/90 backdrop-blur-sm z-50 flex justify-between items-center`}
        >
            {/*Left Side*/}
            <div
                className={"h-full flex"}>
                <div
                    className={"h-full flex items-center px-[50px] justify-center border-r border-custom-gray-800"}
                >
                    <img src={"/Logo.png"} alt={"Logo image"} className={"w-[94%] h-auto"}/>
                </div>
                <div
                    className={"h-full flex items-center justify-center"}
                >
                    <span
                        className={"text-white text-lg font-light ml-[22px]"}
                    >
                        {"Now working on >"}
                    </span>
                    <div
                        className={`flex items-center justify-center gap-[30px] pl-[16px] h-full w-auto`}
                    >
                        <span
                            className={"text-custom-gray-600 text-lg font-light"}>
                            {projectName}
                        </span>
                    </div>
                </div>
            </div>

            {/*Right Side*/}
            <ul
                className={"h-full flex items-center justify-center gap-[30px] text-white pr-[50px]"}
            >
                <li>
                    <button
                        onClick={() => goToHomePage()}
                        className={"flex justify-center items-center cursor-pointer text-sm rounded-full px-[18px] h-[38px] " +
                            "bg-white/10 text-white/60 hover:bg-blue-500 hover:text-white"}
                    >
                        {"Go back >"}
                    </button>
                </li>
            </ul>
            <InformativeModal
                setIsModalOpen={setIsInfoModalOpen}
                isModalOpen={isInfoModalOpen}
                title={"Do not leave the page while time tracking is active."}/>
        </div>
    )


}


export default ProjectCartNavbar;
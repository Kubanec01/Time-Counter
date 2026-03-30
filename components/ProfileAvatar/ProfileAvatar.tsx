import userBgImg from "@/public/gradient-bg.jpg";
import {twMerge} from "tailwind-merge";


export const ProfileAvatar = ({userInitials, className}: { userInitials: string, className?: string }) => {

    const styleClass = `aspect-square w-[32px] rounded-[100px] overflow-hidden flex justify-center items-center text-white text-sm font-base`

    return (
        <div
            style={{
                backgroundImage: `url(${userBgImg.src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
            className={twMerge(styleClass, className)}
        >
            {userInitials}
        </div>
    )
}
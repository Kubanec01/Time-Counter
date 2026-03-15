import userBgImg from "@/public/gradient-bg.jpg";


export const ProfileAvatar = ({userInitials}: { userInitials: string }) => {


    return (
        <div
            style={{
                backgroundImage: `url(${userBgImg.src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
            className={`aspect-square w-[32px] rounded-[100px]
                         overflow-hidden flex justify-center items-center text-white text-sm font-base`}
        >
            {userInitials}
        </div>
    )
}
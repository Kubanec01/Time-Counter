import {FaRegMoon, FaRegSun} from "react-icons/fa";
import {useThemeModeContext} from "@/features/hooks/context/themeModeContext/useThemeModeContext";

const ToggleViewThemeButton = () => {

    const {handleChangeThemeMode, themeMode} = useThemeModeContext()

    const lightThemeImgUrl = "/light-theme-toggle-button-img.jpg"
    const darkThemeImgUrl = "/night-theme-toggle-button-img.png"

    const isThemeDark = themeMode === 'dark'

    return (
        <button
            style={{
                backgroundImage: isThemeDark ? `url(${darkThemeImgUrl})` : `url(${lightThemeImgUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                cursor: "pointer"
            }}
            onClick={handleChangeThemeMode}
            className={'px-2 py-1 rounded-4xl relative w-12.5 h-6 '}>
            <div
            className={`bg-white aspect-square w-4.5 rounded-4xl absolute top-[50%] transition-all duration-300 
            translate-y-[-50%] ${isThemeDark ? 'left-[94%] -translate-x-4.5' : 'left-[6%]'} flex justify-center items-center`}>
                {isThemeDark
                ? <FaRegMoon className={'text-gray-400 text-xs'} />
                : <FaRegSun className={'text-gray-400 text-xs'} />
                }
            </div>
        </button>
    )
}


export default ToggleViewThemeButton
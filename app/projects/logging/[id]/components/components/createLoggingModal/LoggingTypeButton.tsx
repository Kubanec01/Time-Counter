import {LoggingType} from "@/types";

type TagColor =
    "blue"
    | "pink"
    | "green"
    | "gray"
    | "purple"
    | "white"

type ActiveTagColor =
    | "activeBlue"
    | "activePink"
    | "activeGreen"
    | "activeGray"
    | "activePurple"
    | "activeWhite"

const colorVariants: Record<TagColor, string> = {
    blue: "border-pastel-blue-600 text-pastel-blue-600",
    pink: "border-pastel-pink-700 text-pastel-pink-700",
    green: "border-pastel-green-700 text-pastel-green-700",
    gray: "border-custom-gray-600 text-custom-gray-600",
    purple: "border-pastel-purple-700 text-pastel-purple-700",
    white: "border-white text-white",
}

const activeColorVariants: Record<ActiveTagColor, string> = {
    activeBlue: "border-pastel-blue-600 bg-pastel-blue-600 text-black font-medium",
    activePink: "border-pastel-pink-700 bg-pastel-pink-700 text-black font-medium",
    activeGreen: "border-pastel-green-700 bg-pastel-green-700 text-black font-medium",
    activeGray: "border-custom-gray-600 bg-custom-gray-600 text-black font-medium",
    activePurple: "border-pastel-purple-700 bg-pastel-purple-700 text-black font-medium",
    activeWhite: "border-white bg-white text-black font-medium",
}

interface LoggingTypeButtonProps {
    text: string,
    tagColor: TagColor,
    activeTagColor: ActiveTagColor,
    onClick: () => void,
    loggingType: LoggingType,
}

export const LoggingTypeButton = ({...props}: LoggingTypeButtonProps) => {


    const setActiveHighlight = () => {
        if (props.loggingType === props.text) {
            return activeColorVariants[props.activeTagColor]
        } else return colorVariants[props.tagColor]
    }

    return (
        <button
            onClick={props.onClick}
            className={`${setActiveHighlight()} cursor-pointer text-nowrap border rounded-[100px] text-sm py-1 px-3.5`}>
            {props.text}
        </button>
    )
}
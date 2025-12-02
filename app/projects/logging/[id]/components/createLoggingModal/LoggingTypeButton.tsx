type TagColor = "blue" | "pink" | "green" | "gray" | "purple" | "white"

const colorVariants: Record<TagColor, string> = {
    blue: "border-pastel-blue-600 text-pastel-blue-600",
    pink: "border-pastel-pink-700 text-pastel-pink-700",
    green: "border-pastel-green-700 text-pastel-green-700",
    gray: "border-custom-gray-600 text-custom-gray-600",
    purple: "border-pastel-purple-700 text-pastel-purple-700",
    white: "border-white text-white",
}

interface LoggingTypeButtonProps {
    text: string,
    tagColor: TagColor,
}

export const LoggingTypeButton = ({...props}: LoggingTypeButtonProps) => {


    return (
        <button
            className={`${colorVariants[props.tagColor]} cursor-pointer text-nowrap border rounded-[100px] text-sm py-1 px-3.5`}>
            {props.text}
        </button>
    )
}
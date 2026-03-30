import {twMerge} from "tailwind-merge";

type ButtonsListProps = {
    title: string;
    listItems: { id: string, title: string, className?: string, onClick: () => void }[];
    titleClassname?: string
    bodyClassname?: string
}

const ButtonsList = ({...props}: ButtonsListProps) => {

    const titleClass = "text-xs font-medium text-black/64 pb-1"
    const listItemClass = "medium-button border w-full py-1.5 text-black/30 hover:bg-black hover:text-white hover:border-black duration-150"

    return (
        <div
            className={twMerge('', props.bodyClassname)}
        >
            <h1
                className={twMerge(titleClass, props.titleClassname)}
            >
                {props.title}
            </h1>
            <ul
                className={"mt-2 w-full grid grid-rows-2 grid-cols-2 gap-2"}
            >
                {props.listItems.map(item => (
                    <li
                        key={item.id}
                        className={twMerge(listItemClass, item.className)}
                        onClick={item.onClick}
                    >
                        {item.title}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ButtonsList
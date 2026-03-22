import {Switch} from "@headlessui/react";
import {twMerge} from "tailwind-merge";


type SwitchButtonProps = {
    isChecked: boolean
    onChange: () => void
    buttonBodyClassname?: string
    buttonDotClassname?: string
}

const SwitchButton = ({...props}: SwitchButtonProps) => {


    const buttonBodyClass = "group relative flex h-6 w-12.5 cursor-pointer rounded-full bg-black/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-vibrant-purple-600 data-focus:outline data-focus:outline-white"
    const buttonDotClass = "pointer-events-none inline-block size-4.5 translate-x-0 -translate-y-[1px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-6"

    return (
        <Switch
            checked={props.isChecked}
            onChange={props.onChange}
            className={twMerge(buttonBodyClass, props.buttonBodyClassname)}
        >
            <span
                aria-hidden="true"
                className={twMerge(buttonDotClass, props.buttonDotClassname)}
            />
        </Switch>
    )
}


export default SwitchButton
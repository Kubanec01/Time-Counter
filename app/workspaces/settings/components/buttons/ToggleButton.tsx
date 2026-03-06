import {Switch} from "@headlessui/react";


type ToggleButtonProps = {
    title: string;
    specSubtitle: string;
    toggleFunction: () => Promise<void> | void
    isToggleActive: boolean
}

export const ToggleButton = ({...props}: ToggleButtonProps) => {


    return (
        <>
            <div
                className={"border-b border-black/20 py-4"}>
                <div
                    className={"flex items-center justify-between"}>
                    <div
                        className={"w-[80%]"}>
                        <h1
                            className={"text-[20px]"}>
                            {props.title}
                        </h1>
                        <p
                            className={"text-xs  text-black/50 w-[92%]"}>
                            {props.specSubtitle}
                        </p>
                    </div>
                    <Switch
                        checked={props.isToggleActive}
                        onChange={() => props.toggleFunction()}
                        className="group relative flex h-6 w-12.5 cursor-pointer rounded-full bg-black/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-vibrant-purple-600 data-focus:outline data-focus:outline-white"
                    >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none inline-block size-4.5 translate-x-0 -translate-y-[1px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-6"
                                />
                    </Switch>
                </div>
            </div>
        </>
    )
}
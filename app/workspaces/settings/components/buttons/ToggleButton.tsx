import SwitchButton from "@/components/SwitchButton/SwitchButton";


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

                    <SwitchButton
                        isChecked={props.isToggleActive}
                        onChange={() => props.toggleFunction()}
                    />
                </div>
            </div>
        </>
    )
}
import {JSX} from "react";
import {BiSolidMessageAltEdit} from "react-icons/bi";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";

type ChangeFormModalProps = {
    title: string,
    confirmText: string,
    formSection: JSX.Element;
    isFormSent: boolean,
}

export const ChangeFormModal = ({...props}: ChangeFormModalProps) => {

    const {replace} = useReplaceRouteLink()

    return (
        <>
            <div
                className={"w-[290px] border border-black/16 shadow-lg  rounded-xl bg-white/90 p-6 mx-auto"}
            >
                <section
                    className={`${props.isFormSent ? "hidden" : "block"}`}>
                    <BiSolidMessageAltEdit className={"text-[34px] mx-auto"}/>
                    <h1
                        className={"font-semibold mt-2 mb-6 text-center mx-auto w-[80%]"}
                    >
                        {props.title}
                    </h1>
                </section>
                {/* Form */}
                <section
                    className={`${props.isFormSent ? "hidden" : "block"}`}>
                    {props.formSection}
                </section>
                {/* Confirm Message */}
                <section
                    className={`${props.isFormSent ? "block" : "hidden"} flex flex-col items-center justify-center`}
                >
                    <img
                        src={"/purple_checkmark02.png"}
                        alt="name-was-changed-checkmar"
                        className={"aspect-square w-[40%]"}
                    />
                    <p
                        className={"font-bold text-center text-sm w-[60%] mt-2 text-black/70"}>
                        {props.confirmText}
                    </p>
                    <button
                        onClick={() => {
                            replace('/')
                        }}
                        className={"medium-button bg-purple-gradient border-none w-full mt-11"}>
                        Back to Home
                    </button>
                </section>
            </div>
        </>
    )
}
import {GiSunSpear} from "react-icons/gi";
import ModalTemplate from "@/components/modals01/ModalTemplate/ModalTemplate";
import {MediumButton} from "@/components/MediumButton/MediumButton";
import {JSX, ReactNode} from "react";

type ConfirmModalProps = {
    isModalOpen: boolean
    title: string
    description: string
    confirmButtonText: string
    onConfirmClick: () => void
    onCancelClick: () => void
    customIcon?: JSX.Element | ReactNode
}

const ConfirmModal = ({...props}: ConfirmModalProps) => {

    return (
        <section
            style={{display: props.isModalOpen ? "block" : "none"}}
            className={'fixed top-0 left-0 w-full h-screen z-50'}>
            <ModalTemplate
            >
                {props.customIcon
                    ?
                    props.customIcon
                    :
                    <GiSunSpear className={"text-3xl mx-auto shadow-none"}/>
                }
                <div
                    className={"mt-5"}
                >
                    <h1
                        className={"mb-1 font-medium"}
                    >
                        {props.title}
                    </h1>
                    <p
                        className={"text-sm text-black/70 w-11/12"}
                    >
                        {props.description}
                    </p>
                    <div
                        className={"flex flex-col items-center justify-center gap-3 mt-10"}>
                        <MediumButton
                            onClick={props.onConfirmClick}
                            className={"w-full bg-black-gradient border-none"}
                        >
                            {props.confirmButtonText}
                        </MediumButton>
                        <MediumButton
                            onClick={props.onCancelClick}
                            className={"w-full border-none rounded-md hover:bg-black/15 text-black/70 duration-150"}
                        >
                            Back
                        </MediumButton>
                    </div>
                </div>
            </ModalTemplate>
        </section>
    )

}

export default ConfirmModal;



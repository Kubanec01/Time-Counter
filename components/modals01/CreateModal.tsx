import ModalTemplate from "@/components/modals01/ModalTemplate/ModalTemplate";
import {JSX, ReactNode} from "react";
import {GiSunSpear} from "react-icons/gi";
import {MediumButton} from "@/components/MediumButton/MediumButton";
import {twMerge} from "tailwind-merge";

type CreateModalProps = {
    title: string;
    description: string;
    isOpen: boolean;
    onSubmit: () => void;
    cancelButtonFn: () => void;
    children: ReactNode | JSX.Element;
    confirmBtnText: string;
    className?: string;
    confirmBtnClassname?: string;
    cancelBtnClassname?: string;
    iconClassName?: string;
}

const CreateModal = ({...props}: CreateModalProps) => {


    return (
        <section
            style={{display: props.isOpen ? "block" : "none"}}
            className={"fixed top-0 left-0 w-full h-screen z-50"}>
            <ModalTemplate
                className={props.className}
            >
                <GiSunSpear className={twMerge("text-3xl mx-auto shadow-none", props.iconClassName)}/>
                <div
                    className={"mt-4"}
                >
                    <h1
                        className={"font-medium"}>
                        {props.title}
                    </h1>
                    <p
                        className={"text-sm text-black/70 w-11/12 mt-1"}>
                        {props.description}
                    </p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        props.onSubmit()
                    }}
                    className={"mt-5"}
                >
                    {props.children}
                    <div
                        className={'flex items-center justify-between'}
                    >
                        <MediumButton
                            buttonType={'button'}
                            onClick={() => props.cancelButtonFn()}
                            className={"px-6  text-black/70 border-black/1 hover:bg-black/16"}
                        >
                            Cancel
                        </MediumButton>
                        <MediumButton
                            buttonType={'submit'}
                            className={"bg-purple-gradient px-6 rounded-md"}
                        >
                            {props.confirmBtnText}
                        </MediumButton>
                    </div>
                </form>
            </ModalTemplate>
        </section>
    )

}


export default CreateModal;
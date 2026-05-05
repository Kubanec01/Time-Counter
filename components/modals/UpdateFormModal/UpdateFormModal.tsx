import {BiSolidMessageAltEdit} from "react-icons/bi";
import {FormEvent} from "react";

export type InputCollection = {
    id: string
    label: string
    type: "text" | "email" | "password" | "number"
    placeholder: string
    value: string
    onChange: (eventValue: string) => void
}

type UpdateFormModalProps = {
    title: string,
    confirmBtnLabel: string,
    secondaryConfirmBtnLabel: string,
    confirmText: string,
    isFormSent: boolean,
    handleBackBtnFn: () => void
    errorMessage: string | null
    isUpdateDataLoading: boolean
    onSubmitFn: (e: FormEvent) => Promise<void>
    primaryInputsCollection: InputCollection[]
    secondaryInputsCollection: InputCollection[]
}

const UpdateFormModal = ({...props}: UpdateFormModalProps) => {


    return (
        <>
            <div
                className={"w-75 border border-black/16 shadow-lg rounded-xl bg-white/30 backdrop-blur-lg p-6 mx-auto"}>
                <section>
                    <BiSolidMessageAltEdit className={"text-[34px] mx-auto"}/>
                    <h1
                        className={"font-semibold mt-2 mb-6 text-center mx-auto w-[80%]"}>
                        {props.title}
                    </h1>
                </section>
                {/* Form */}
                <form
                    onSubmit={props.onSubmitFn}
                    className={`${props.isFormSent ? "hidden" : "block"}
                    flex flex-col gap-3`}>
                    {props.primaryInputsCollection.map(input => (
                        <div
                            key={input.id}
                            className={"w-full"}>
                            <label
                                htmlFor={input.id}
                                className={"text-xs font-bold"}>
                                {input.label}
                            </label>
                            <input
                                className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                                id={input.id}
                                onChange={e => input.onChange(e.target.value)}
                                placeholder={input.placeholder}
                                type={input.type}
                                value={input.value}
                            />
                        </div>
                    ))}
                    {props.secondaryInputsCollection.map(input => (
                        <div
                            key={input.id}
                            className={"w-full mt-1"}>
                            <label
                                htmlFor={input.id}
                                className={"text-xs font-bold"}>
                                {input.label}
                            </label>
                            <input
                                className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                                id={input.id}
                                onChange={e => input.onChange(e.target.value)}
                                placeholder={input.placeholder}
                                type={input.type}
                                value={input.value}
                            />
                        </div>
                    ))}
                    <span
                        className={"text-center text-sm text-red-600"}>
                        {props.errorMessage}
                    </span>
                    <button
                        disabled={props.isUpdateDataLoading}
                        type="submit"
                        className={"medium-button bg-black-gradient mt-4"}>
                        {props.confirmBtnLabel}
                    </button>
                    <button
                        type="button"
                        onClick={props.handleBackBtnFn}
                        className={"text-[13px] font-bold text-black/50 mt-1 cursor-pointer hover:underline"}>
                        {props.secondaryConfirmBtnLabel}
                    </button>
                </form>
                {/* Confirm Message */}
                <section
                    className={`${props.isFormSent ? "block" : "hidden"} mt-6 flex flex-col items-center justify-center`}>
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
                        onClick={props.handleBackBtnFn}
                        className={"medium-button bg-purple-gradient border-none w-full mt-9 mb-3"}>
                        {props.secondaryConfirmBtnLabel}
                    </button>
                </section>
            </div>
        </>
    )

}


export default UpdateFormModal
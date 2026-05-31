'use client'

import {createPortal} from "react-dom";
import {useEffect, useState} from "react";
import {LuBadgeInfo} from "react-icons/lu";
import {InputCollection} from "@/components/modals01/UpdateFormModal/UpdateFormModal";
import {MediumButton} from "@/components/MediumButton/MediumButton";

type TwoFactorDeleteModalProps = {
    primaryInputCollection: InputCollection[],
    secondaryInputCollection: InputCollection[]
    submitFirstFactorFn: () => void
    submitSecondFactorFn: () => void
    isFirstFactorSuccessful: boolean
    isSecondFactorSuccessful: boolean
    closeModalFn?: () => void
    confirmText: string
    isModalOpen: boolean
    isProcesLoading: boolean
    isConfirmBtnDisabled: boolean
    submitBtnText: string
    cancelBtnText: string
    secondaryConfirmBtnLabel: string
    cancelBtnFn: () => void
    title: string
    description: string
    secondFactorDescription: string
}

const TwoFactorDeleteModal = ({...props}: TwoFactorDeleteModalProps) => {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true)
    }, []);

    const secondaryInputsCollection = props.secondaryInputCollection || []


    const setDescription = () => {
        if (!props.isFirstFactorSuccessful) return props.description
        else if (props.isSecondFactorSuccessful) return props.confirmText
        else return props.secondFactorDescription
    }

    if (!isMounted || !props.isModalOpen) return null
    return (
        createPortal(
            <div
                className={'fixed top-1/2 left-1/2 -translate-1/2 border border-white/40 rounded-lg ' +
                    'w-11/12 max-w-75 px-6 py-6'}>
                <div
                    className={`flex justify-center items-center text-red-700 text-3xl`}>
                    <LuBadgeInfo/>
                </div>
                <div
                    className={'mt-6'}>
                    <h1
                        className={'text-red-600/90 font-semibold'}>
                        {props.title}
                    </h1>
                    <p
                        className={`text-sm text-white/70 font-light mt-1`}>
                        {setDescription()}
                    </p>
                </div>
                {/* First factor form */}
                <section
                    className={`${props.isSecondFactorSuccessful ? 'hidden' : 'block'}`}>
                    <form
                        className={`${props.isFirstFactorSuccessful ? 'hidden' : 'block'}`}
                        onSubmit={(event) => {
                            event.preventDefault()
                            props.submitFirstFactorFn()
                        }}>
                        <section
                            className={'flex flex-col gap-4 mt-8'}>
                            {props.primaryInputCollection.map(input => (
                                <div
                                    key={input.id}
                                    className={"w-full"}>
                                    <label
                                        htmlFor={input.id}
                                        className={"text-xs text-white/60 font-light"}>
                                        {input.label}
                                    </label>
                                    <input
                                        className={"w-full border border-white/40" +
                                            " text-white/80 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                                        id={input.id}
                                        onChange={e => input.onChange(e.target.value)}
                                        placeholder={input.placeholder}
                                        type={input.type}
                                        value={input.value}
                                    />
                                </div>
                            ))}
                            {secondaryInputsCollection.map(input => (
                                <div
                                    key={input.id}
                                    className={"w-full"}>
                                    <label
                                        htmlFor={input.id}
                                        className={"text-xs text-white/60 font-light"}>
                                        {input.label}
                                    </label>
                                    <input
                                        className={"w-full border border-white/40 text-white/80 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                                        id={input.id}
                                        onChange={e => input.onChange(e.target.value)}
                                        placeholder={input.placeholder}
                                        type={input.type}
                                        value={input.value}
                                    />
                                </div>
                            ))}
                        </section>
                        <MediumButton
                            disabled={props.isConfirmBtnDisabled}
                            buttonType="submit"
                            className={`${props.isConfirmBtnDisabled ? 'bg-disabled-gradient' : 'bg-black-gradient'}
                            bg-red-gradient text-white w-full medium-button mt-8 rounded-sm`}>
                            {props.submitBtnText}
                        </MediumButton>
                        <button
                            type="button"
                            onClick={props.cancelBtnFn}
                            className={"text-sm font-light text-white/60 mt-2 hover:bg-white/10 py-1 rounded-sm w-full cursor-pointer"}>
                            {props.cancelBtnText}
                        </button>
                    </form>
                    {/*  Second factor form  */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault()
                            props.submitSecondFactorFn()
                        }}
                        className={`${props.isFirstFactorSuccessful ? 'block' : 'hidden'}`}>
                        <div
                            className={'flex flex-col gap-2 mt-8'}>
                            <MediumButton
                                disabled={props.isConfirmBtnDisabled}
                                buttonType={'submit'}
                                className={`${props.isConfirmBtnDisabled ? 'bg-disabled-gradient' : 'bg-black-gradient'}
                                bg-red-gradient text-white w-full medium-button rounded-sm`}>
                                {props.secondaryConfirmBtnLabel}
                            </MediumButton>
                            <button
                                type={'button'}
                                onClick={props.cancelBtnFn}
                                className={"text-sm font-light text-white/60 hover:bg-white/10 py-1 rounded-sm w-full cursor-pointer"}>
                                {props.cancelBtnText}
                            </button>
                        </div>
                    </form>
                </section>
                <section
                    className={`${props.isSecondFactorSuccessful ? 'block' : 'hidden'}`}>
                    <button
                        onClick={props.cancelBtnFn}
                        className={"medium-button rounded-sm bg-red-gradient border-none w-full mt-9 mb-3"}>
                        {props.cancelBtnText}
                    </button>
                </section>
            </div>,
            document.body
        )
    )

}

export default TwoFactorDeleteModal;
'use client'

import {createPortal} from "react-dom";
import {useEffect, useState} from "react";
import {LuX} from "react-icons/lu";
import {useErrorBannerContext} from "@/features/hooks/context/useErrorBannerContext";


const ErrorBannerModal = () => {
    const {errorCode, setErrorCode} = useErrorBannerContext()
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])


    const ErrorLabels: Readonly<Record<string, string>> = {
        // General
        UNKNOWN_ERROR: "Something went wrong. Please try again later.",
        // User
        EMPTY_INPUTS: 'Please fill in all required fields.',
        PASSWORDS_NOT_MATCH: 'Passwords do not match.',
        INVALID_PASSWORD: 'Wrong password. Please try again.',
        USER_NOT_FOUND: 'User not found. Please check your credentials.',
        WEAK_PASSWORD: 'Your password is too weak. Please use a stronger password with at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters.',
        INVALID_PASSWORD_OR_MAIL: 'Incorrect email or password',
        // Workspace
        WORKSPACE_NOT_FOUND: 'Workspace not found. Please check your credentials.',
        WRONG_PASSWORD: 'Wrong password. Please try again.',
        INVALID_PERMISSION: 'You don\'t have permission to join this workspace.'
    }

    const handleClose = () => {
        setErrorCode(null)
    }

    if (!isMounted || !errorCode) return null

    return (
        createPortal(
            <section
                style={{zIndex: 9999}}
                className={'fixed top-0 left-0 w-full py-5 px-6 text-cloud-white bg-[#f15e6b] flex justify-center items-center'}>
                <div
                    className={'flex justify-between items-center max-w-4xl w-11/12'}>
                    <h1
                        className={'text-sm w-10/12'}>
                        {ErrorLabels[errorCode] ?? 'Something went wrong. Please try again later.'}
                    </h1>
                    <button
                        type={'button'}
                        title={'Close banner'}
                        onClick={handleClose}
                        className={'text-2xl cursor-pointer'}>
                        <LuX/>
                    </button>
                </div>
            </section>,
            document.body
        )
    )
}

export default ErrorBannerModal
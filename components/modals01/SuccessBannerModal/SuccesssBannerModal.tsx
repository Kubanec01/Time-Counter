import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {LuX} from "react-icons/lu";
import {useSuccessCodeContext} from "@/features/hooks/context/successCodeContext/useSuccessCodeContext";



const SuccessBannerModal = () => {
    const {successCode, setSuccessCode} = useSuccessCodeContext()
    const [isMounted, setIsMounted] = useState(false)



    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true)
    }, [])


    const successLabels: Readonly<Record<string, string>> = {
        CHANGES_UPDATED: 'Changes updated successfully',
        WORKSPACE_CREATED: 'Workspace created successfully',
        WORKSPACE_UPDATED: 'Workspace updated successfully',
    }

    const handleClose = () => {
        setSuccessCode(null)
    }

    if (!isMounted || !successCode) return null

    return (
        createPortal(
            <section
                style={{zIndex: 9999}}
                className={'fixed top-0 left-0 w-full py-5 px-6 text-cloud-white bg-light-green-400 flex justify-center items-center'}>
                <div
                    className={'flex justify-between items-center max-w-4xl w-11/12'}>
                    <h1
                        className={'text-sm w-10/12'}>
                        {successLabels[successCode] ?? 'Something went wrong. Please try again later.'}
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

export default SuccessBannerModal
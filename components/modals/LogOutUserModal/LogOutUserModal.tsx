import {createPortal} from "react-dom";
import ConfirmModal from "@/components/modals01/ConfirmModal";
import {FaUser} from "react-icons/fa";
import React from "react";
import {useSignOutUser} from "@/features/hooks/useSignOutUser";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {useErrorBannerContext} from "@/features/hooks/context/useErrorBannerContext";


type LogOutUserModalProps = {
    isLogoutModalOpen: boolean
    onCancelClickFn: () => void
    onConfirmFn: () => void
}

const LogOutUserModal = ({...props}: LogOutUserModalProps) => {
    const {signOutUser} = useSignOutUser()
    const {replace} = useReplaceRouteLink()
    const {setErrorCode} = useErrorBannerContext()

    const signOut = () => {
        signOutUser()
            .then(() => replace("/"))
            .catch(err => {
                console.log(err.message)
                setErrorCode('UNKNOWN_ERROR')
            })
    }

    return (
        createPortal(
            <ConfirmModal
                isModalOpen={props.isLogoutModalOpen}
                title={"Log Out of Synto?"}
                description={"You can always log back in anywhere, anytime. Your progress will be saved without any worries."}
                onCancelClick={props.onCancelClickFn}
                confirmButtonText={"Log Out"}
                customIcon={<><FaUser className={"w-full text-2xl"}/></>}
                onConfirmClick={() => {
                    props.onConfirmFn()
                    signOut()
                }}
            />,
            document.body
        )
    )
}

export default LogOutUserModal
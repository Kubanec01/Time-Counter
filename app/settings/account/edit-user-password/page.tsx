'use client'

import RadialPurpleGradientBg from "@/components/RadialPurpleGradientBg/RadialPurpleGradientBg";
import UpdateFormModal, {InputCollectionList} from "@/components/modals/UpdateFormModal/UpdateFormModal";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import {mainHomePageUrlPath} from "@/data/Url_Paths/urlPaths";
import {useErrorBannerContext} from "@/features/hooks/context/useErrorBannerContext";
import {FirebaseError} from "@firebase/app";


const EditUserPassword = () => {

    const [isFormSent, setIsFormSent] = useState<boolean>(false)
    const [errorMess, setErrorMess] = useState<string | null>(null)
    const [isProcessLoading, setIsProcessLoading] = useState<boolean>(false)
    const [oldPassword, setOldPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('')
    const router = useRouter()
    const {setErrorCode} = useErrorBannerContext()

    const isInputsEmpty = oldPassword.trim() === '' || newPassword.trim() === '' || newPasswordConfirm.trim() === ''

    const handleNavigate = () => {
        if (isFormSent) router.replace(mainHomePageUrlPath)
        else router.back()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (newPassword !== newPasswordConfirm) return setErrorCode('PASSWORDS_NOT_MATCH')
        else if (newPassword.trim() === '') return setErrorCode('EMPTY_INPUTS')

        const auth = getAuth()
        const user = auth.currentUser
        const userEmail = user?.email

        if (!userEmail) return console.error('User is not logged in')


        try {
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential)
            await updatePassword(user, newPassword)
            setIsProcessLoading(false)
            setIsFormSent(true)
            setErrorCode(null)
        } catch (error) {
            setIsProcessLoading(false)
            if (error instanceof FirebaseError) {
                console.log(error.code)
                if (error.code === 'auth/weak-password') setErrorCode('WEAK_PASSWORD')
                else if (error.code === 'auth/invalid-credential') setErrorCode('INVALID_PASSWORD')
            } else setErrorCode('UNKNOWN_ERROR')
        }
    }

    const inputCollection: InputCollectionList = {
        'primary': [
            {
                id: 'old-password',
                label: 'Old Password',
                type: 'password',
                placeholder: 'Enter your old password',
                value: oldPassword,
                onChange: (eventValue) => setOldPassword(eventValue)
            }
        ],
        'secondary': [
            {
                id: 'user-password',
                label: 'New Password',
                type: 'password',
                placeholder: 'Enter your new password',
                value: newPassword,
                onChange: (eventValue) => setNewPassword(eventValue)
            },
            {
                id: 'user-password-confirm',
                label: 'Confirm New Password',
                type: 'password',
                placeholder: 'Confirm your new password',
                value: newPasswordConfirm,
                onChange: (eventValue) => setNewPasswordConfirm(eventValue)
            }
        ]
    }


    return (
        <RadialPurpleGradientBg>
            <UpdateFormModal
                title={'Change Password'}
                confirmBtnLabel={'Change'}
                secondaryConfirmBtnLabel={'Go Back'}
                confirmText={'Your password was updated!'}
                isConfirmBtnDisabled={isInputsEmpty || isProcessLoading}
                isFormSent={isFormSent}
                handleBackBtnFn={handleNavigate}
                errorMessage={errorMess}
                isUpdateDataLoading={isProcessLoading}
                onSubmitFn={handleSubmit}
                primaryInputsCollection={inputCollection.primary}
                secondaryInputsCollection={inputCollection.secondary}
            />
        </RadialPurpleGradientBg>
    )
}

export default EditUserPassword
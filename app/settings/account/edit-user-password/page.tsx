'use client'

import RadialPurpleGradientBg from "@/components/RadialPurpleGradientBg/RadialPurpleGradientBg";
import UpdateFormModal, {InputCollectionList} from "@/components/modals/UpdateFormModal/UpdateFormModal";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import {mainHomePageUrlPath} from "@/data/Url_Paths/urlPaths";


const EditUserPassword = () => {

    const [isFormSent, setIsFormSent] = useState<boolean>(false)
    const [errorMess, setErrorMess] = useState<string | null>(null)
    const [isProcessLoading, setIsProcessLoading] = useState<boolean>(false)
    const [oldPassword, setOldPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('')
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if(newPassword !== newPasswordConfirm) return setErrorMess('Passwords do not match')
        else if(newPassword.trim() === '') return setErrorMess('Password cannot be empty')

        const auth = getAuth()
        const user = auth.currentUser
        const userEmail = user?.email

        if(!userEmail) return console.error('User is not logged in')


        try {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential)
        await updatePassword(user, newPassword)
            setIsProcessLoading(false)
            setIsFormSent(true)
        } catch (error) {
            console.error(error)
            setIsProcessLoading(false)
            setErrorMess('Something went wrong, try again later.')
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
            secondaryConfirmBtnLabel={'Back to Home'}
            confirmText={'Your password was updated!'}
            isFormSent={isFormSent}
            handleBackBtnFn={() => router.replace(mainHomePageUrlPath)}
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
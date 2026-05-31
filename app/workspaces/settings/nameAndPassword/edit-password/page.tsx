'use client'

import {FormEvent, useState} from "react";
import {useWorkSpaceContext} from "@/features/hooks/context/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, updateDoc} from "firebase/firestore";
import {useGetWorkspacePassword} from "@/features/hooks/useGetWorkspacePassword";
import UpdateFormModal, {
    InputCollection,
    InputCollectionList
} from "@/components/modals01/UpdateFormModal/UpdateFormModal";
import {useRouter} from "next/navigation";
import RadialPurpleGradientBg from "@/components/RadialPurpleGradientBg/RadialPurpleGradientBg";

const WorkspacePassword = () => {

    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSent, setIsFormSent] = useState(false);
    const {workspaceId} = useWorkSpaceContext()
    const {password} = useGetWorkspacePassword()
    const router = useRouter()

    const changeWorkspacePassword = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        if (currPassword !== password) {
            setIsLoading(false);
            return setErrMessage("Wrong password, try again...");
        } else if (newPassword !== confirmPassword) {
            setIsLoading(false)
            return setErrMessage("Passwords do not match (≥o≤)");
        } else if (password.trim() === "" || confirmPassword.trim() === "") {
            setIsLoading(false)
            return setErrMessage("Something went wrong, try it gain.");
        }

        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)
        await updateDoc(docRef, {password: newPassword})
        setCurrPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setIsLoading(false);
        setIsFormSent(true);
    }


    const inputCollection: InputCollectionList = {
        'primary': [
            {
                id: 'workspace-password',
                label: 'Workspace password',
                type: 'password',
                placeholder: "Enter workspace password",
                onChange: (eventValue) => setCurrPassword(eventValue),
                value: currPassword
            },
        ],
        'secondary': [
            {
                id: 'new-password',
                label: 'New password',
                type: 'password',
                placeholder: "Enter new password",
                onChange: (eventValue) => setNewPassword(eventValue),
                value: newPassword
            },
            {
                id: 'confirm-password',
                label: 'Confirm password',
                type: 'password',
                placeholder: "Confirm new password",
                onChange: (eventValue) => setConfirmPassword(eventValue),
                value: confirmPassword
            }
        ]
    }

    return (
        <RadialPurpleGradientBg>
            <UpdateFormModal
                title={'Change workspace password'}
                confirmBtnLabel={'Change'}
                secondaryConfirmBtnLabel={'Go Back'}
                confirmText={'Workspace name has been updated!'}
                isFormSent={isFormSent}
                handleBackBtnFn={() => router.back()}
                errorMessage={errMessage}
                isUpdateDataLoading={isLoading}
                onSubmitFn={changeWorkspacePassword}
                primaryInputsCollection={inputCollection.primary}
                secondaryInputsCollection={inputCollection.secondary}/>
        </RadialPurpleGradientBg>
    )
}


export default WorkspacePassword
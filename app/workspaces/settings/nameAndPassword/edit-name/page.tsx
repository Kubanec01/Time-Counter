'use client'

import {FormEvent, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, updateDoc} from "firebase/firestore";
import {useGetWorkspacePassword} from "@/features/hooks/useGetWorkspacePassword";
import RadialPurpleGradientBg from "@/components/RadialPurpleGradientBg/RadialPurpleGradientBg";
import UpdateFormModal, {
    InputCollection,
    InputCollectionList
} from "@/components/modals/UpdateFormModal/UpdateFormModal";
import {useRouter} from "next/navigation";

const WorkspaceName = () => {

    const [workspacePassword, setWorkspacePassword] = useState("");
    const [name, setName] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSent, setIsFormSent] = useState(false);
    const {workspaceId} = useWorkSpaceContext()
    const {password} = useGetWorkspacePassword()
    const router = useRouter()

    const changeWorkspaceName = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        if (name.trim() === "") {
            setIsLoading(false)
            return setErrMessage("Something went wrong, try again...");
        } else if (workspacePassword !== password) {
            setIsLoading(false)
            return setErrMessage("Wrong password, try again...");
        }

        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)
        await updateDoc(docRef, {workspaceName: name})
        setName("")
        setIsLoading(false);
        setIsFormSent(true)
    }
    
    const formModalCollections: InputCollectionList = {
        'primary': [
            {
            id: 'workspace-password',
            label: 'Workspace password',
            type: 'password',
            placeholder: "Enter workspace password",
            onChange: (eventValue) => setWorkspacePassword(eventValue),
            value: workspacePassword
        }
        ],
        'secondary': [
            {
                id: 'workspace-name',
                label: 'Workspace name',
                type: 'text',
                placeholder: "Enter workspace new name",
                onChange: (eventValue) => setName(eventValue),
                value: name
            }
        ]
    }

    return (
        <RadialPurpleGradientBg>
            <UpdateFormModal
                title={"Change workspace name"}
                confirmBtnLabel={'Change'}
                secondaryConfirmBtnLabel={'Go Back'}
                confirmText={"Workspace name has been updated!"}
                isFormSent={isFormSent}
                handleBackBtnFn={() => router.back()}
                errorMessage={errMessage}
                isUpdateDataLoading={isLoading}
                onSubmitFn={changeWorkspaceName}
                primaryInputsCollection={formModalCollections.primary}
                secondaryInputsCollection={formModalCollections.secondary}/>
        </RadialPurpleGradientBg>
    )
}


export default WorkspaceName
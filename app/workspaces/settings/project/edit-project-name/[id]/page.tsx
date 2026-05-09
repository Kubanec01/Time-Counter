'use client'

import {FormEvent, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useGetWorkspacePassword} from "@/features/hooks/useGetWorkspacePassword";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {useParams, useRouter} from "next/navigation";
import UpdateFormModal, {
    InputCollection,
    InputCollectionList
} from "@/components/modals/UpdateFormModal/UpdateFormModal";
import {useProjectData} from "@/features/hooks/useProjectData";


export default function EditProjectNamePage() {


    const [workspacePassword, setWorkspacePassword] = useState("");
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSent, setIsFormSent] = useState(false);
    const {workspaceId} = useWorkSpaceContext()
    const {password} = useGetWorkspacePassword()
    const router = useRouter()
    const projectId = useParams().id as string
    const {status} = useProjectData(workspaceId, projectId)

    const changeWorkspaceName = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        if (newProjectTitle.trim() === "") {
            setIsLoading(false)
            return setErrMessage("Something went wrong, try again...");
        } else if (workspacePassword !== password) {
            setIsLoading(false)
            return setErrMessage("Wrong password, try again...");
        }

        if (!workspaceId || workspaceId === "unused" || status === 'not-found') return

        const docRef = doc(db, 'realms', workspaceId, 'projects', projectId)

        await updateDoc(docRef, {title: newProjectTitle})
        setNewProjectTitle("")
        setIsLoading(false);
        setIsFormSent(true)
    }

    const inputCollections: InputCollectionList =  {
        'primary': [
            {
                id: 'workspace-password',
                label: 'Workspace password',
                type: 'password',
                placeholder: "Enter workspace password",
                onChange: (eventValue) => setWorkspacePassword(eventValue),
                value: workspacePassword
            },
    ],
        'secondary': [
            {
                id: 'project-name',
                label: 'Project name',
                type: 'text',
                placeholder: "Enter new project name",
                onChange: (eventValue) => setNewProjectTitle(eventValue),
                value: newProjectTitle
            }
        ]
    }


    return (
        <section
            className="w-full h-screen flex flex-col justify-center items-center bg-radial from-gradient-purple to-white to-40%">
            <UpdateFormModal
                title={'Change project name'}
                confirmBtnLabel={'Change'}
                secondaryConfirmBtnLabel={'Go back'}
                confirmText={'Project name has been updated!'}
                isFormSent={isFormSent}
                handleBackBtnFn={() => router.back()}
                errorMessage={errMessage}
                isUpdateDataLoading={isLoading}
                onSubmitFn={changeWorkspaceName}
                primaryInputsCollection={inputCollections.primary}
                secondaryInputsCollection={inputCollections.secondary}/>
        </section>
    )
}
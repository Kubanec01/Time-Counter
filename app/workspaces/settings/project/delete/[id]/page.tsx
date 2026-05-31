'use client'

import TwoFactorDeleteModal from "@/components/modals01/TwoFactorDeleteModal";
import {useState} from "react";
import {InputCollectionList} from "@/components/modals01/UpdateFormModal/UpdateFormModal";
import {useWorkSpaceContext} from "@/features/hooks/context/workspaceContext";
import {useGetWorkspacePassword} from "@/features/hooks/useGetWorkspacePassword";
import {useErrorBannerContext} from "@/features/hooks/context/useErrorBannerContext";
import {useParams, useRouter} from "next/navigation";
import {deleteProject} from "@/features/utilities/delete/deleteProject";
import {mainHomePageUrlPath} from "@/data/Url_Paths/urlPaths";

const DeleteProjectMainPage = () => {

    const router = useRouter()
    const {password} = useGetWorkspacePassword()
    const {setErrorCode} = useErrorBannerContext()
    const {workspaceId} = useWorkSpaceContext()
    const projectId = useParams().id as string
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isFirstFactorProcessSuccessful, setIsFirstFactorProcessSuccessful] = useState<boolean>(false)
    const [isSecondFactorProcessSuccessful, setIsSecondFactorProcessSuccessful] = useState<boolean>(false)
    const [workspacePassword, setWorkspacePassword] = useState<string>("")

    const firstFactorSubmit = () => {
        setIsLoading(true)
        if (workspacePassword !== password) {
            setIsLoading(false)
            setErrorCode('INVALID_PASSWORD')
            return
        }
        setIsLoading(false)
        setErrorCode(null)
        setIsFirstFactorProcessSuccessful(true)
    }

    const secondFactorSubmit = async () => {
        setIsLoading(true)
        deleteProject(workspaceId, projectId)
            .then(() => {
                setIsLoading(false)
                setIsSecondFactorProcessSuccessful(true)
            })
            .catch(() => {
                setIsLoading(false)
                setErrorCode('UNKNOWN_ERROR')
            })
    }


    const deleteProjectCollectionList: InputCollectionList = {
        primary: [
            {
                id: 'workspace-password',
                label: 'Workspace password',
                type: 'password',
                placeholder: "Enter workspace password",
                onChange: (eventValue) => setWorkspacePassword(eventValue),
                value: workspacePassword
            },
        ],
        secondary: []
    }


    return (
        <div
            className={'relative bg-dark-bg h-full w-full'}>
            <TwoFactorDeleteModal
                primaryInputCollection={deleteProjectCollectionList.primary}
                secondaryInputCollection={deleteProjectCollectionList.secondary}
                submitFirstFactorFn={firstFactorSubmit}
                submitSecondFactorFn={secondFactorSubmit}
                isFirstFactorSuccessful={isFirstFactorProcessSuccessful}
                isSecondFactorSuccessful={isSecondFactorProcessSuccessful}
                confirmText={'Project has been deleted!'}
                isModalOpen={true}
                isProcesLoading={isLoading}
                isConfirmBtnDisabled={isLoading}
                submitBtnText={'Delete'}
                cancelBtnFn={() => router.replace(mainHomePageUrlPath)}
                secondaryConfirmBtnLabel={'Yes, Delete'}
                cancelBtnText={'Go Home'}
                title={'Delete Project'}
                description={'By deleting this project, you will lose all of your data and your colleagues\' data. Your colleagues will never see this data again, and all work on the project will be permanently stopped.'}
                secondFactorDescription={'If you want to delete the project, please notify your colleagues. This process is irreversible. Are your sure you want to delete project?'}/>
        </div>
    )
}

export default DeleteProjectMainPage
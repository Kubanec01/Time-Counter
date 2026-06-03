'use client'

import TwoFactorDeleteModal from "@/components/modals01/TwoFactorDeleteModal";
import {mainHomePageUrlPath} from "@/data/Url_Paths/urlPaths";
import {useWorkSpaceContext} from "@/features/hooks/context/workspaceContext";
import {useState} from "react";
import {InputCollectionList} from "@/components/modals01/UpdateFormModal/UpdateFormModal";
import {useGetWorkspacePassword} from "@/features/hooks/useGetWorkspacePassword";
import {useErrorBannerContext} from "@/features/hooks/context/useErrorBannerContext";
import {deleteWorkspace} from "@/features/utilities/delete/deleteWorkspace";
import {router} from "next/client";
import {useLeaveWorkspace} from "@/features/hooks/useLeaveWorkspace";


const DeleteWorkspacePage = () => {

    const {password} = useGetWorkspacePassword()
    const {leaveWorkspace} = useLeaveWorkspace()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isFirstFactorProcessSuccessful, setIsFirstFactorProcessSuccessful] = useState<boolean>(false)
    const [isSecondFactorProcessSuccessful, setIsSecondFactorProcessSuccessful] = useState<boolean>(false)
    const [workspacePassword, setWorkspacePassword] = useState<string>("")
    const {setErrorCode} = useErrorBannerContext()
    const {workspaceId, userId} = useWorkSpaceContext()


    const handleFirstFactorSubmit = () => {
        setIsLoading(true)
        if (workspacePassword !== password) {
            setIsLoading(false)
            setErrorCode('INVALID_PASSWORD')
            return
        }
        setIsLoading(false)
        setIsFirstFactorProcessSuccessful(true)
        setErrorCode(null)
    }

    const handleSecondFactorSubmit = () => {
        setIsLoading(true)
        if(!userId) {
            setIsLoading(false)
            setErrorCode('UNKNOWN_ERROR')
            return
        }

        deleteWorkspace({userId: userId, workspaceId: workspaceId})
            .then(() => {
                console.log('podarilo sa')
                setIsLoading(false)
                leaveWorkspace()
            })
            .catch(() => {
                setIsLoading(false)
                setErrorCode('UNKNOWN_ERROR')
            })
    }

    const navigateUSer = () => {
        if(!isSecondFactorProcessSuccessful) router.replace(mainHomePageUrlPath)
        else leaveWorkspace()
    }


    const deleteWorkspaceCollectionList: InputCollectionList = {
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
                primaryInputCollection={deleteWorkspaceCollectionList.primary}
                secondaryInputCollection={deleteWorkspaceCollectionList.secondary}
                submitFirstFactorFn={handleFirstFactorSubmit}
                submitSecondFactorFn={handleSecondFactorSubmit}
                isFirstFactorSuccessful={isFirstFactorProcessSuccessful}
                isSecondFactorSuccessful={isSecondFactorProcessSuccessful}
                confirmText={'Workspace has been deleted!'}
                isModalOpen={true}
                isProcesLoading={isLoading}
                isConfirmBtnDisabled={isLoading}
                submitBtnText={'Delete'}
                cancelBtnFn={() => router.replace(mainHomePageUrlPath)}
                secondaryConfirmBtnLabel={'Yes, Delete'}
                cancelBtnText={'Go Home'}
                title={'Delete Workspace'}
                description={'By deleting this workspace, you will lose all of your data and your colleagues\' data. Your colleagues will never see this data again, and all work on the workspace will be permanently stopped.'}
                secondFactorDescription={'If you want to delete the workspace, please notify your colleagues. This process is irreversible. Are your sure you want to delete workspace?'}/>
        </div>
    );
}

export default DeleteWorkspacePage
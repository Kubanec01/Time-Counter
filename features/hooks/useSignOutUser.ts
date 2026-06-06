import {Auth, signOut} from "@firebase/auth";
import {useLeaveWorkspace} from "@/features/hooks/useLeaveWorkspace";
import {auth} from "../../app/config/firebase/config";


export const useSignOutUser = () => {

    const {leaveWorkspace} = useLeaveWorkspace()


    const signOutUser = async () => {
        try {
            await signOut(auth)
            leaveWorkspace()
        } catch (err) {
            console.error(err)
        }
    }

    return {signOutUser}
}
import {Auth, signOut} from "@firebase/auth";
import {useLeaveWorkspace} from "@/features/hooks/useLeaveWorkspace";


export const useSignOutUser = (auth: Auth) => {

    const {leaveWorkspace} = useLeaveWorkspace()

    const signOutUser = () => {
        signOut(auth).catch((error) => console.log(error.message));
        leaveWorkspace()
    }

    return {signOutUser}

}
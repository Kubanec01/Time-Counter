import {UserMode, WorkspaceId} from "@/types";
import {doc, DocumentReference} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {invalidUserId, missingWorkspaceId} from "@/messages/errors";


export const getFirestoreTargetRef = (
    userId: string | undefined,
    mode: UserMode,
    workspaceId: WorkspaceId,
): DocumentReference => {
    if (!userId) throw new Error(invalidUserId);

    if (mode === "solo") return doc(db, "users", userId);
    if (mode === "workspace") {
        if (!workspaceId) throw new Error(missingWorkspaceId);
        return doc(db, "realms", workspaceId);
    }
    throw new Error(`Invalid mode:`);
}
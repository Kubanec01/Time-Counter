import {collection, getDocs} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Project} from "@/types";

export const getAllProjects = async (workspaceId: string) => {

    const projectsSnap = await getDocs(collection(db, 'realms', workspaceId, 'projects'))
    return projectsSnap.docs.map(doc => doc.data() as Project);

}
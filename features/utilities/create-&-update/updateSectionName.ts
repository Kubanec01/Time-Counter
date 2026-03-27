import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Section, WorkspaceId} from "@/types";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";


export const updateSectionName = async (
    projectId: string,
    sectionId: string,
    workspaceId: WorkspaceId,
    newName: string,
) => {

    const docRef = doc(db, "realms", workspaceId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error(documentNotFound);
    const data = docSnap.data();
    const sections: Section[] = data.projectsSections

    const updatedSections = sections.map((s: Section) => {
        if (s.projectId !== projectId) return s;
        if (s.sectionId !== sectionId) return s;
        return {...s, title: newName};
    })
    await updateDoc(docRef, {projectsSections: updatedSections});
}
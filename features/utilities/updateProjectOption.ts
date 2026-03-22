import {ProjectOption} from "@/types";
import {db} from "@/app/firebase/config";
import {doc, updateDoc} from "firebase/firestore";


export const updateProjectOptions = async (
    workspaceId: string,
    projectId: string,
    projectOptions: ProjectOption[] | undefined,
    selectedOption: ProjectOption
) => {
    if (!projectOptions) return console.error("Project options not found");

    const docRef = doc(db, "realms", workspaceId, 'projects', projectId)

    const updatedOptions = projectOptions.map((option) => {
        if (option.value !== selectedOption.value) return option;
        return {...option, active: !option.active}
    })

    await updateDoc(docRef, {options: updatedOptions})
}
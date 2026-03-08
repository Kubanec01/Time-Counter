import {ProjectOption} from "@/types";
import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {documentNotFound} from "@/messages/errors";
import {LoggingProject} from "@/features/utilities/create/createNewProject";


export const updateProjectOptions = async (workspaceId: string, projectId: string, selectedOption: ProjectOption) => {

    const docRef = doc(db, "realms", workspaceId)
    const snapDoc = await getDoc(docRef)
    if (!snapDoc.exists()) return console.error(documentNotFound)
    const data = snapDoc.data()
    const updatedProjects = data.projects.map((project: LoggingProject) => {
        if (project.projectId !== projectId) return project

        const updatedOptions = project.options.map((option: ProjectOption) => {
            if (option.value !== selectedOption.value) return option

            const isOptionActive = !option.active

            return {...option, active: isOptionActive}
        })

        return {...project, options: updatedOptions}

    })

    await updateDoc(docRef, {projects: updatedProjects})

}
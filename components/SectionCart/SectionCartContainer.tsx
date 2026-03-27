'use client'

import {twMerge} from "tailwind-merge";
import React, {JSX, ReactNode, useState} from "react";
import {FaRegEdit} from "react-icons/fa";
import {FiTrash2} from "react-icons/fi";
import {createPortal} from "react-dom";
import ConfirmModal from "@/components/modals01/ConfirmModal";
import CreateModal from "@/components/modals01/CreateModal";
import {deleteSection} from "@/features/utilities/delete/deleteSection";
import {updateSectionName} from "@/features/utilities/create-&-update/updateSectionName";
import {TextInput} from "@/components/TextInput/TextInput";


type SectionCartProps = {
    dataInfo: { userId: string, workspaceId: string, projectId: string, sectionId: string, updatedDate: string };
    sectionList: { id: string, content: JSX.Element | ReactNode }[]
    listClassName?: string;
    bodyClassname?: string;
    listItemClassName?: string;
    menuButtonsClassname?: string
    children?: JSX.Element | ReactNode;
}

const SectionCartContainer = ({...props}: SectionCartProps) => {

    // States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [newSectionName, setNewSectionName] = useState("");

    const dataInfo = props.dataInfo

    // Style
    const bodyClass = "w-full rounded-md bg-white text-black/70 text-sm font-medium items-center px-4 py-1.5 relative"
    const listClass = "w-full flex items-center justify-start"
    const listItemClass = `w-1/${props.sectionList.length}`
    const menuButtonClass = `text-sm text-black/40 cursor-pointer`

    const isTextInvalid = newSectionName.trim().length === 0

    const renameSection = () => {
        if (isTextInvalid) return

        updateSectionName(
            dataInfo.projectId,
            dataInfo.sectionId,
            dataInfo.workspaceId,
            newSectionName
        ).catch(err => console.log(err.message));

        setNewSectionName("")
        setIsRenameModalOpen(false);
    }

    return (
        <div
            className={twMerge(bodyClass, props.bodyClassname)}
        >
            <ul
                className={twMerge(listClass, props.listClassName)}
            >
                {props.sectionList.map(section => (
                    <li
                        key={section.id}
                        className={twMerge(listItemClass, props.listItemClassName)}
                    >
                        {section.content}
                    </li>
                ))}
            </ul>
            <section
                className={"absolute top-2.5 right-3.5 flex items-center justify-center gap-3.5"}>
                <button
                    onClick={() => setIsRenameModalOpen(!isRenameModalOpen)}
                    className={twMerge(`${menuButtonClass} hover:text-vibrant-purple-500`, props.menuButtonsClassname)}
                >
                    <FaRegEdit/>
                </button>
                <button
                    onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                    className={twMerge(`${menuButtonClass} hover:text-red-300`, props.menuButtonsClassname)}
                >
                    <FiTrash2/>
                </button>
                {/* Delete Modal */}
                {createPortal(
                    <ConfirmModal
                        isModalOpen={isDeleteModalOpen}
                        title={"Delete time track"}
                        description={"Are you sure you want to delete this time section? This action is irreversible and all data from this time period will be deleted."}
                        confirmButtonText={"Delete"}
                        onCancelClick={() => setIsDeleteModalOpen(false)}
                        onConfirmClick={() => deleteSection(
                            dataInfo.userId,
                            dataInfo.updatedDate,
                            dataInfo.workspaceId,
                            dataInfo.projectId,
                            dataInfo.sectionId
                        )}
                    />,
                    document.body
                )}
                {/* Rename Section Modal */}
                {createPortal(
                    <CreateModal
                        className={"h-[290px]"}
                        title={"Rename time track"}
                        description={"You can rename Time Track to anything you want — anytime. The possibilities are endless."}
                        isOpen={isRenameModalOpen}
                        cancelButtonFn={() => setIsRenameModalOpen(false)}
                        confirmBtnText={"Rename"}
                        onSubmit={() => renameSection()}

                    >
                        <TextInput
                            inputId={"new-track-name-input"}
                            placeholder={"Enter new track name..."}
                            inputClassname={"mb-4"}
                            value={newSectionName}
                            isIconVisible={false}
                            OnChange={(value) => setNewSectionName(value)}
                        />
                    </CreateModal>,
                    document.body
                )}
            </section>
            {props.children}
        </div>
    )
}

export default SectionCartContainer
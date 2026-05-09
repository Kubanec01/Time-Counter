'use client'

import RadialPurpleGradientBg from "@/components/RadialPurpleGradientBg/RadialPurpleGradientBg";
import UpdateFormModal, {InputCollectionList} from "@/components/modals/UpdateFormModal/UpdateFormModal";
import {useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {LoadingPage} from "@/app/LoadingPage/LoadingPage";
import {documentNotFound} from "@/messages/errors";


const EditUserName = () => {
    const [isFormSent , setIsFormSent] = useState<boolean>(false)
    const [errorMess, setErrorMess] = useState<string | null>(null)
    const [isProcessLoading, setIsProcessLoading] = useState<boolean>(false)
    const [name, setName] = useState< string|null>(null)
    const [surname, setSurname] = useState< string| null>(null)
    const [newName, setNewName] = useState< string|null>(null)
    const [newSurname, setNewSurname] = useState< string| null>(null)
    const router = useRouter()
    const {userId} = useWorkSpaceContext()

    // Fetch initial states
    useEffect(() => {
        if(!userId) return

        const updateData = async () => {
            const docRef = doc(db, 'users', userId)
            const docSnap = await getDoc(docRef)
            if(!docSnap.exists()) return console.error(documentNotFound)
            const data = docSnap.data()
            setName(data.name)
            setNewName(data.name)
            setSurname(data.surname)
            setNewSurname(data.surname)
        }
        updateData().catch(() => console.error('Failed to fetch user data'))
    }, [userId])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        setIsProcessLoading(true)

        if(!newName || !newSurname || !userId) return console.error('Name, surname and userId are required fields')
        else if(newName.trim() === '' || newSurname.trim() === '') return setErrorMess('Name and surname cannot be empty')
        else if(newName === name && newSurname === surname) return setIsProcessLoading(false)

        const docRef = doc(db, 'users', userId)

        await updateDoc(docRef, {name: newName, surname: newSurname}).catch(() => {
            setErrorMess('Failed to update user name, try again later.')
            setIsProcessLoading(false)
        })

        setIsFormSent(true)
        setIsProcessLoading(false)
    }

    if(newName === null || newSurname === null) return <LoadingPage/>

    const inputCollection: InputCollectionList = {
    'primary' : [
        {
            id: 'user-name',
            label: 'First Name',
            type: 'text',
            placeholder: 'Enter your first name',
            value: newName,
            onChange: (eventValue) => setNewName(eventValue)
        },
        {
            id: 'user-surname',
            label: 'Last Name',
            type: 'text',
            placeholder: 'Enter your last name',
            value: newSurname,
            onChange: (eventValue) => setNewSurname(eventValue)
        }
    ],
        'secondary': []
    }

    return (
        <RadialPurpleGradientBg>
        <UpdateFormModal
            title={'Change Full name'}
            confirmBtnLabel={'Change'}
            secondaryConfirmBtnLabel={'Go back'}
            confirmText={'Your full name was updated!'}
            isFormSent={isFormSent}
            handleBackBtnFn={() => router.back()}
            errorMessage={errorMess}
            isUpdateDataLoading={isProcessLoading}
            onSubmitFn={handleSubmit}
            primaryInputsCollection={inputCollection.primary}/>
        </RadialPurpleGradientBg>
    )
}

export default EditUserName
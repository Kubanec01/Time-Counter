'use client'


import {useParams} from "next/navigation";

export default function UserPage() {

    const id = useParams().id

    return (
        <>
        this is page of user num. {id}
        </>
    )
}
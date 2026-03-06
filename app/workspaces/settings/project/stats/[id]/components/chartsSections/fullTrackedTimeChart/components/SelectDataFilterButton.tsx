import {Dispatch, SetStateAction} from "react";


type SelectDataFilterButtonProps = {
    options: { value: string, title: string }[]
    setOption: Dispatch<SetStateAction<string>>
}

export const SelectDataFilterButton = () => {


    return (
        <>
            <select name="" id="">

            </select>
        </>
    )
}
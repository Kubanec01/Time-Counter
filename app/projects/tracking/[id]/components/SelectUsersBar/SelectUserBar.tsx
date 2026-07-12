import {SelectBar} from "@/components/SelectBar/SelectBar";
import {BaseOption, Member} from "@/types";


type SelectUserBarProps = {
    members: Member[]
    selectedMember: string
    onSelectMember: (memberId: string) => void
}

const SelectUserBar = ({...props}: SelectUserBarProps) => {

    const selectBarOptions:  BaseOption[] = [
        {value: "all", label: "All Users"},
    ...props.members.map(member => ({value: member.userId, label: `${member.name} ${member.surname}`}))
    ]

    return (
        <section
        className={"w-11/12 max-w-medium mx-auto flex justify-start mb-2 mt-6"}>
            <SelectBar
                options={selectBarOptions}
                value={props.selectedMember}
                onChange={props.onSelectMember}
                inputClassname={'border border-black/20 outline-none px-2 h-8.5 text-sm rounded-md bg-white'}
                inputId={'select-member-data'}/>
        </section>
    )
}

export default SelectUserBar
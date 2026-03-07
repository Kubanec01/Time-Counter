

type SelectDataFilterButtonProps = {
    options: { value: string, title: string }[]
    updateFilter: (value: "week" | "month" | "year") => void
}

export const SelectDataFilterButton = ({...props}: SelectDataFilterButtonProps) => {


    return (
        <>
            <select
                name="select-time-data"
                id="select-time-data"
                onChange={(e) => props.updateFilter(e.target.value as "week" | "month" | "year")}
                className={"text-xs rounded-md bg-black/6 text-black/70 h-7 px-1 cursor-pointer outline-none"}
            >
                {props.options.map(option => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.title}
                    </option>
                ))}
            </select>
        </>
    )
}
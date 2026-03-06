

type MaxTrackingTimeProps = {
    title: string;
    value: string;
    changeFunction: (value: number) => void;
}

export const MaxTrackingTime = ({...props}: MaxTrackingTimeProps) => {


    return (
        <>
            <div
                className={"border-b border-black/20 pt-3 pb-5"}>
                <h1
                    className={"text-[20px]"}>
                    {props.title}
                </h1>
                <select
                    name="max-tracking-time"
                    value={props.value}
                    onChange={(e) => props.changeFunction(Number(e.target.value))}
                    className={"border border-black/20 px-2 w-[226px] text-xs py-1 rounded-full outline-none mt-2"}
                >
                    <option value="86400">24 Hours</option>
                    <option value="43200">12 Hours</option>
                    <option value="32400">9 Hours</option>
                    <option value="21600">6 Hours</option>
                    <option value="14400">4 Hours</option>
                </select>
            </div>
        </>
    )
}
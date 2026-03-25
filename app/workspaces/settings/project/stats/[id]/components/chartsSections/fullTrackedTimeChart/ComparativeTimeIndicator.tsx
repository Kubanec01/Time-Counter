import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";

type ComparativeTimeIndicatorProps = {
    differenceValue: number
    differencePercentage: number
}

export const ComparativeTimeIndicator = ({...props}: ComparativeTimeIndicatorProps) => {

    const timeStringValue = formatSecondsToTimeString(Math.abs(props.differenceValue))
    const getPercentageValue = () => {
        if (props.differencePercentage === Infinity) return 0
        else return props.differencePercentage
    }

    return (
        <div
            className={"bg-vibrant-purple-400 rounded-xl p-4"}>
            <p
                className={"text-sm text-white/90"}>
                Compared time</p>
            <h1
                className={"text-2xl w-[70%] mt-2 font-medium text-white"}>
                Difference between today’s and yesterday’s tracked time
            </h1>
            <section>
                <div
                    className={"flex items-center justify-center w-[170px] gap-2 rounded-xl text-black/80 bg-white/94 py-1.5 text-xl font-medium mt-4"}>
                    {timeStringValue}
                    <span
                        className={`${getPercentageValue() >= 0 ? "bg-light-green text-dark-green" : "bg-red-400/80 text-red-900"}
                        text-xs p-0.5 px-1.5 rounded-sm bg-light-green text-dark-green font-semibold`}>
                        {getPercentageValue() > 0 && "+"}{getPercentageValue()}%
                    </span>
                </div>
            </section>
        </div>
    )
}
import ReactECharts from "echarts-for-react";

type PieChartProps = {
    data: { value: number, name: string }[];
}

export const PieChart = ({...props}: PieChartProps) => {


    const option = {
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                type: 'pie',
                radius: '60%',
                data: props.data
            }
        ]
    };


    return (
        <ReactECharts
            option={option}
            style={{width: '100%', height: '100%'}}
        />
    )
}
import ReactECharts from "echarts-for-react";


type AreaChartProps = {
    yAxisData: number[],
    xAxisData: string[] | number[],
}

export const AreaChart = ({...props}: AreaChartProps) => {


    const option = {
        xAxis: {
            type: 'category',
            data: props.xAxisData
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: props.yAxisData,
                type: 'line'
            }
        ]
    };


    return (
        <ReactECharts
            style={{width: "100%", height: "100%"}}
            option={option}/>
    )
}
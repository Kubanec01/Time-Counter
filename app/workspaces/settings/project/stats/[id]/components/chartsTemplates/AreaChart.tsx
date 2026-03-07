import ReactECharts from "echarts-for-react";


type AreaChartProps = {
    yAxisData: (number | null)[],
    xAxisData: string[] | number[],
}

export const AreaChart = ({...props}: AreaChartProps) => {


    const option = {

        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
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
                type: 'line',
                color: '#6C47FF',
            }
        ]
    };


    return (
        <ReactECharts
            style={{width: "100%", height: "100%"}}
            option={option}/>
    )
}
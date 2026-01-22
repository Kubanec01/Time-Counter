'use client'

import ReactECharts from 'echarts-for-react'

interface LineChartProps {
    yAxisData: number[],
    yAxisTitle: string,
    xAxisData: string[] | number[],
}

export const LineChart = ({...props}: LineChartProps) => {


    const option = {
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: props.xAxisData,
        },
        yAxis: {
            type: 'value',
            name: props.yAxisTitle,
        },
        series: [
            {
                type: 'bar',
                data: props.yAxisData,
                barWidth: '40%',
            },
        ],
    }

    return (
        <ReactECharts
            option={option}
            style={{width: '100%', height: '100%'}}
        />
    )
}

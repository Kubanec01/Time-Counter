'use client'

import ReactECharts from 'echarts-for-react'

type LineChartProps = {
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
                color: '#6C47FF',
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

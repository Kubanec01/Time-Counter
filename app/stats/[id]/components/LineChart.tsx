'use client'

import ReactECharts from 'echarts-for-react'

export const LineChart = ({data}: { data: number[] }) => {


    const option = {
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
            name: 'Hours',
        },
        series: [
            {
                type: 'bar',
                data: data,
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

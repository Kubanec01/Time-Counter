import ReactECharts from "echarts-for-react";

type PieChartProps = {
    data: { value: number, name: string }[];
}

export const PieChart = ({...props}: PieChartProps) => {


    const option = {
        color: [
            '#6C47FF',
            '#8A6BFF',
            '#38A8C8',
            '#4CAF7A',
            '#7FBF4A',
            '#E6B91E',
            '#E38A3B',
            '#D864A3'
        ],
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                type: 'pie',
                radius: '80%',
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
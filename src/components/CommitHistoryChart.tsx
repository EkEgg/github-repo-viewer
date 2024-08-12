import { useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { add, format } from "date-fns";
import { FC } from "react";

const CHART_COLOR = {
    light: ["#2e7d32"],
    dark: ["#66bb6a"]
};

const CHART_HEIGHT = 260;

const CommitHistoryChart: FC<{
        data: Map<number, number>,
        range: {
            begin: Date,
            end: Date
        }
    }> = ({ data, range }) =>
    {
        const theme = useTheme();
        const chartColor = CHART_COLOR[theme.palette.mode];

        const labels: string[] = [];
        const values: number[] = [];
        for (let i = new Date(range.begin); i <= range.end; i = add(i, { days: 1 }))
        {
            labels.push(format(i, "yyyy/MM/dd"));
            const count = data.get(i.getTime());
            values.push(!count ? 0 : count);
        }

        return (
            <BarChart
                xAxis={[{ scaleType: "band", data: labels }]}
                series={[{ data: values }]}
                grid={{ horizontal: true }}
                height={CHART_HEIGHT}
                colors={chartColor}
            />
        );
    };

export default CommitHistoryChart;

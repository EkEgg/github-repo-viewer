import { Grid, useTheme } from "@mui/material";
import { PieChart, BarChart } from "@mui/x-charts";
import { FC } from "react";
import { toPercentage } from "../lib/number-utils";

const CHART_COLORS = {
    light: ["#1976d2", "#d32f2f", "#9c27b0", "#ed6c02", "#2e7d32"],
    dark: ["#42a5f5", "#d32f2f", "#ab47bc", "#f57c00", "#388e3c"]
};

const CHART_HEIGHT = 260;

const LanguageChart: FC<{ data: { [key: string]: number }}> = ({ data }) =>
    {
        const dataArray: { language: string, percentage: number }[] = []
        for (const language in data)
        {
            dataArray.push({ language, percentage: data[language] });
        }

        const theme = useTheme();
        const chartColors = CHART_COLORS[theme.palette.mode];

        const pieChart = (
            <PieChart
                series={[{
                    data: dataArray.map(({ language, percentage }, index) => ({
                        id: index,
                        value: percentage,
                        label: language
                    })),
                    innerRadius: 40,
                    outerRadius: 100,
                    valueFormatter: (value) => toPercentage(value.value, 2)
                }]}
                colors={chartColors}
                slotProps={{
                    legend: {
                        labelStyle: {
                            fontSize: 12
                        }
                    }
                }}
            />
        );

        const barChart = (
            <BarChart
                xAxis={[{
                    scaleType: "band",
                    data: dataArray.map(({ language }) => language),
                    colorMap: {
                        type: "ordinal",
                        colors: chartColors
                    }
                }]}
                yAxis={[{
                    min: 0,
                    max: 1,
                    valueFormatter: (value) => !value ? "" : toPercentage(value, 0)
                }]}
                series={[{
                    data: dataArray.map(({ percentage }) => percentage),
                    valueFormatter: (value) => !value ? "" : toPercentage(value, 2)
                }]}
                grid={{ horizontal: true }}
            />
        );

        return (
            <Grid container height={CHART_HEIGHT}>
                <Grid item xs={6}>
                    {pieChart}
                </Grid>
                <Grid item xs={6}>
                    {barChart}
                </Grid>
            </Grid>
            
        );
    };

export default LanguageChart;

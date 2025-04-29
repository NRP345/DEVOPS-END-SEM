
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/utils/insightsUtils";
import { prepareMonthlyExpenseData } from "@/utils/insightsUtils";
import CustomTooltip from "./CustomTooltip";

interface MonthlyExpenseChartProps {
  expenses: Expense[];
  timeRange: string;
}

const MonthlyExpenseChart = ({ expenses, timeRange }: MonthlyExpenseChartProps) => {
  const data = prepareMonthlyExpenseData(expenses, timeRange);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expense Trend</CardTitle>
        <CardDescription>How your expenses change over time</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name="Expenses"
                stroke="#2563EB"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground mt-20">No expense data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyExpenseChart;

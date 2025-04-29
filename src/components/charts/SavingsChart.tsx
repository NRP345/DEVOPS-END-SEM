
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SavingGoal } from "@/utils/insightsUtils";
import { prepareSavingsData } from "@/utils/insightsUtils";
import CustomTooltip from "./CustomTooltip";

interface SavingsChartProps {
  savings: SavingGoal[];
}

const SavingsChart = ({ savings }: SavingsChartProps) => {
  const data = prepareSavingsData(savings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goals Progress</CardTitle>
        <CardDescription>Current vs Target amounts</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="current" name="Current Amount" fill="#10B981" />
              <Bar dataKey="target" name="Target Amount" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground mt-20">No savings data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsChart;

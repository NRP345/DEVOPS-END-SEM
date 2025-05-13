
import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/insightsUtils";
import { prepareAllocationData } from "@/utils/insightsUtils";

interface AllocationChartProps {
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
}

const AllocationChart = ({ totalExpenses, totalSavings, totalInvestments }: AllocationChartProps) => {
  const data = prepareAllocationData(totalExpenses, totalSavings, totalInvestments);
  const total = totalExpenses + totalSavings + totalInvestments;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Distribution</CardTitle>
        <CardDescription>How your money is allocated</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#EF4444" /> {/* Expenses - Red */}
                <Cell fill="#10B981" /> {/* Savings - Green */}
                <Cell fill="#2563EB" /> {/* Investments - Blue */}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground mt-20">No financial data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AllocationChart;


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
import { Investment } from "@/utils/insightsUtils";
import { prepareInvestmentData } from "@/utils/insightsUtils";
import CustomTooltip from "./CustomTooltip";

interface InvestmentsChartProps {
  investments: Investment[];
}

const InvestmentsChart = ({ investments }: InvestmentsChartProps) => {
  const data = prepareInvestmentData(investments);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Performance</CardTitle>
        <CardDescription>Initial investment vs current value</CardDescription>
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
              <Bar dataKey="invested" name="Amount Invested" fill="#2563EB" />
              <Bar dataKey="current" name="Current Value" fill="#14B8A6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground mt-20">No investment data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentsChart;

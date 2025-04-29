
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";

// Import the chart components
import ExpenseCategoryChart from "@/components/charts/ExpenseCategoryChart";
import MonthlyExpenseChart from "@/components/charts/MonthlyExpenseChart";
import SavingsChart from "@/components/charts/SavingsChart";
import InvestmentsChart from "@/components/charts/InvestmentsChart";
import AllocationChart from "@/components/charts/AllocationChart";

// Import other components
import FinancialOverview from "@/components/insights/FinancialOverview";
import FinancialTips from "@/components/insights/FinancialTips";

// Import utilities
import { Expense, SavingGoal, Investment, loadInsightsData, filterDataByTimeRange } from "@/utils/insightsUtils";

const Insights = () => {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savings, setSavings] = useState<SavingGoal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [timeRange, setTimeRange] = useState("last6Months");

  useEffect(() => {
    if (user) {
      const data = loadInsightsData(user.id);
      setExpenses(data.expenses);
      setSavings(data.savings);
      setInvestments(data.investments);
    }
  }, [user]);

  // Calculate financial overview metrics
  const totalExpenses = filterDataByTimeRange(expenses, timeRange).reduce(
    (sum, expense) => sum + expense.amount, 0
  );
  const totalSavings = savings.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalAssets = totalSavings + totalInvestments;
  const netWorth = totalAssets - totalExpenses;

  return (
    <div className="animate-fade-in">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Insights</h1>
          <p className="text-muted-foreground">
            Analytics and visualizations of your financial data
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last1Month">Last Month</SelectItem>
            <SelectItem value="last3Months">Last 3 Months</SelectItem>
            <SelectItem value="last6Months">Last 6 Months</SelectItem>
            <SelectItem value="last12Months">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </header>

      {/* Financial Overview */}
      <FinancialOverview
        totalExpenses={totalExpenses}
        totalSavings={totalSavings}
        totalInvestments={totalInvestments}
        netWorth={netWorth}
      />

      {/* Charts */}
      <Tabs defaultValue="expenses" className="mb-8">
        <TabsList className="w-full mb-6 grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseCategoryChart expenses={expenses} timeRange={timeRange} />
            <MonthlyExpenseChart expenses={expenses} timeRange={timeRange} />
          </div>
        </TabsContent>
        <TabsContent value="savings">
          <SavingsChart savings={savings} />
        </TabsContent>
        <TabsContent value="investments">
          <InvestmentsChart investments={investments} />
        </TabsContent>
        <TabsContent value="allocation">
          <AllocationChart 
            totalExpenses={totalExpenses} 
            totalSavings={totalSavings} 
            totalInvestments={totalInvestments} 
          />
        </TabsContent>
      </Tabs>

      {/* Financial Tips */}
      <FinancialTips />
    </div>
  );
};

export default Insights;

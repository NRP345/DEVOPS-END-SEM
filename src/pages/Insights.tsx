
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChartConfig, LineProps } from "recharts";
import { useUser } from "@/contexts/UserContext";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

interface Investment {
  id: string;
  name: string;
  amount: number;
  roi: number;
  date: string;
  type: string;
}

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#6366F1"];

const Insights = () => {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savings, setSavings] = useState<SavingGoal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [timeRange, setTimeRange] = useState("last6Months");

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;
    
    // Load expenses
    const expensesData = localStorage.getItem(`fintrack_expenses_${user.id}`);
    if (expensesData) {
      setExpenses(JSON.parse(expensesData));
    }
    
    // Load savings
    const savingsData = localStorage.getItem(`fintrack_savings_${user.id}`);
    if (savingsData) {
      setSavings(JSON.parse(savingsData));
    }
    
    // Load investments
    const investmentsData = localStorage.getItem(`fintrack_investments_${user.id}`);
    if (investmentsData) {
      setInvestments(JSON.parse(investmentsData));
    }
  };

  // Filter data based on time range
  const filteredData = (data: any[], dateField = 'date') => {
    let startDate;
    const now = new Date();
    
    switch (timeRange) {
      case 'last1Month':
        startDate = subMonths(now, 1);
        break;
      case 'last3Months':
        startDate = subMonths(now, 3);
        break;
      case 'last6Months':
        startDate = subMonths(now, 6);
        break;
      case 'last12Months':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 6);
    }
    
    return data.filter(item => new Date(item[dateField]) >= startDate);
  };

  // Prepare expense category data for pie chart
  const expenseCategoryData = () => {
    const filtered = filteredData(expenses);
    const categories = filtered.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  // Prepare monthly expense data for line chart
  const monthlyExpenseData = () => {
    const filtered = filteredData(expenses);
    
    // Get unique months in the filtered data
    const months = new Set();
    filtered.forEach(expense => {
      const monthYear = format(new Date(expense.date), 'MMM yyyy');
      months.add(monthYear);
    });
    
    // Sort months chronologically
    const sortedMonths = Array.from(months).sort((a: any, b: any) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Calculate total expense for each month
    return sortedMonths.map((month: any) => {
      const monthDate = new Date(month);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      
      const monthlyExpenses = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return isWithinInterval(expenseDate, { start, end });
      });
      
      const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        month,
        total,
      };
    });
  };

  // Prepare savings data
  const savingsData = () => {
    return savings.map(goal => ({
      name: goal.name,
      current: goal.currentAmount,
      target: goal.targetAmount,
    }));
  };

  // Prepare investment data
  const investmentData = () => {
    return investments.map(inv => {
      const currentValue = inv.amount * (1 + inv.roi / 100);
      const gain = currentValue - inv.amount;
      
      return {
        name: inv.name,
        invested: inv.amount,
        current: currentValue,
        gain,
      };
    });
  };

  // Calculate financial overview metrics
  const totalExpenses = filteredData(expenses).reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = savings.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalAssets = totalSavings + totalInvestments;
  const netWorth = totalAssets - totalExpenses;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background p-3 border rounded-md shadow-md">
          <p className="label font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderExpenseChart = () => {
    const data = expenseCategoryData();
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown by Category</CardTitle>
          <CardDescription>How you're spending your money</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {data.length > 0 ? (
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
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground mt-20">No expense data available</p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderMonthlyExpenseChart = () => {
    const data = monthlyExpenseData();
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

  const renderSavingsChart = () => {
    const data = savingsData();
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

  const renderInvestmentsChart = () => {
    const data = investmentData();
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

  const renderAllocationChart = () => {
    // Calculate total allocation percentages
    const total = totalExpenses + totalSavings + totalInvestments;
    
    const data = [
      { name: "Expenses", value: totalExpenses },
      { name: "Savings", value: totalSavings },
      { name: "Investments", value: totalInvestments },
    ];

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
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSavings)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalInvestments)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Worth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(netWorth)}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

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
            {renderExpenseChart()}
            {renderMonthlyExpenseChart()}
          </div>
        </TabsContent>
        <TabsContent value="savings">
          {renderSavingsChart()}
        </TabsContent>
        <TabsContent value="investments">
          {renderInvestmentsChart()}
        </TabsContent>
        <TabsContent value="allocation">
          {renderAllocationChart()}
        </TabsContent>
      </Tabs>

      {/* Financial Tips */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Financial Tips</h2>
        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold text-primary mb-2">Budget Optimization</h3>
                <p>Consider setting a monthly budget for categories where you spend the most.</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold text-secondary mb-2">Savings Strategy</h3>
                <p>Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt.</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold text-investment mb-2">Investment Tips</h3>
                <p>Consider diversifying your investments across different asset classes to reduce risk.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export default Insights;

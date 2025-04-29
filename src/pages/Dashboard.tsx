
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Wallet, TrendingUp, BarChart } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface FinancialData {
  totalBalance: number;
  monthlyExpenses: number;
  totalSavings: number;
  totalInvestments: number;
}

const Dashboard = () => {
  const { user } = useUser();
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalBalance: 0,
    monthlyExpenses: 0,
    totalSavings: 0,
    totalInvestments: 0,
  });

  useEffect(() => {
    if (user) {
      loadFinancialData();
    }
  }, [user]);

  const loadFinancialData = () => {
    if (!user) return;

    // Load expenses
    const expensesData = localStorage.getItem(`fintrack_expenses_${user.id}`);
    const expenses = expensesData ? JSON.parse(expensesData) : [];
    
    // Load savings
    const savingsData = localStorage.getItem(`fintrack_savings_${user.id}`);
    const savings = savingsData ? JSON.parse(savingsData) : [];
    
    // Load investments
    const investmentsData = localStorage.getItem(`fintrack_investments_${user.id}`);
    const investments = investmentsData ? JSON.parse(investmentsData) : [];
    
    // Calculate financial metrics
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const monthlyExpenses = expenses
      .filter((expense: any) => new Date(expense.date) >= firstDayOfMonth)
      .reduce((total: number, expense: any) => total + expense.amount, 0);
    
    const totalSavings = savings.reduce((total: number, saving: any) => total + saving.currentAmount, 0);
    
    const totalInvestments = investments.reduce((total: number, investment: any) => {
      // Calculate current value based on ROI
      const currentValue = investment.amount * (1 + investment.roi / 100);
      return total + currentValue;
    }, 0);
    
    // Total balance = Savings + Investments - Monthly Expenses
    const totalBalance = totalSavings + totalInvestments - monthlyExpenses;
    
    setFinancialData({
      totalBalance,
      monthlyExpenses,
      totalSavings,
      totalInvestments
    });
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your financial overview.
        </p>
      </header>

      {/* Financial Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Balance"
            value={formatCurrency(financialData.totalBalance)}
            description="Net worth"
            className="border-l-4 border-primary"
          />
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(financialData.monthlyExpenses)}
            description="This month"
            className="border-l-4 border-expense"
          />
          <StatCard
            title="Savings"
            value={formatCurrency(financialData.totalSavings)}
            description="Total saved"
            className="border-l-4 border-savings"
          />
          <StatCard
            title="Investments"
            value={formatCurrency(financialData.totalInvestments)}
            description="Current value"
            className="border-l-4 border-investment"
          />
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAccessCard
            icon={<FileText className="h-8 w-8" />}
            title="Expense Tracker"
            description="Manage and track your daily expenses"
            linkTo="/expenses"
            color="text-expense"
          />
          <QuickAccessCard
            icon={<Wallet className="h-8 w-8" />}
            title="Savings Tracker"
            description="Set and monitor your savings goals"
            linkTo="/savings"
            color="text-savings"
          />
          <QuickAccessCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Investment Tracker"
            description="Track performance of your investments"
            linkTo="/investments"
            color="text-investment"
          />
        </div>
      </section>

      {/* Insights Button */}
      <section className="mt-8 flex justify-center">
        <Link to="/insights">
          <Button className="gap-2">
            <BarChart className="h-4 w-4" />
            View Financial Insights
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  description,
  className,
}: {
  title: string;
  value: string;
  description: string;
  className?: string;
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const QuickAccessCard = ({
  icon,
  title,
  description,
  linkTo,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  color: string;
}) => {
  return (
    <Link to={linkTo} className="block">
      <Card className="transition-all hover:shadow-md hover:-translate-y-1">
        <CardHeader>
          <div className={`${color} mb-2`}>{icon}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost" className="w-full justify-between gap-4">
            Go to {title} <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
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

export default Dashboard;

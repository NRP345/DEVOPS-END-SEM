
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  roi: number;
  date: string;
  type: string;
}

// Helper function to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Filter data based on time range
export const filterDataByTimeRange = (data: any[], timeRange: string, dateField = 'date') => {
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
export const prepareExpenseCategoryData = (expenses: Expense[], timeRange: string) => {
  const filtered = filterDataByTimeRange(expenses, timeRange);
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
export const prepareMonthlyExpenseData = (expenses: Expense[], timeRange: string) => {
  const filtered = filterDataByTimeRange(expenses, timeRange);
  
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
export const prepareSavingsData = (savings: SavingGoal[]) => {
  return savings.map(goal => ({
    name: goal.name,
    current: goal.currentAmount,
    target: goal.targetAmount,
  }));
};

// Prepare investment data
export const prepareInvestmentData = (investments: Investment[]) => {
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

// Prepare financial allocation data
export const prepareAllocationData = (totalExpenses: number, totalSavings: number, totalInvestments: number) => {
  return [
    { name: "Expenses", value: totalExpenses },
    { name: "Savings", value: totalSavings },
    { name: "Investments", value: totalInvestments },
  ];
};

export const loadInsightsData = (userId: string) => {
  // Load expenses
  const expensesData = localStorage.getItem(`fintrack_expenses_${userId}`);
  const expenses = expensesData ? JSON.parse(expensesData) : [];
  
  // Load savings
  const savingsData = localStorage.getItem(`fintrack_savings_${userId}`);
  const savings = savingsData ? JSON.parse(savingsData) : [];
  
  // Load investments
  const investmentsData = localStorage.getItem(`fintrack_investments_${userId}`);
  const investments = investmentsData ? JSON.parse(investmentsData) : [];
  
  return { expenses, savings, investments };
};

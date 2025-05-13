
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface Investment {
  id: string;
  name: string;
  amount: number;
  roi: number;
  date: string;
  type: string;
}

const investmentTypes = [
  "Stocks",
  "Bonds",
  "ETFs",
  "Mutual Funds",
  "Real Estate",
  "Cryptocurrency",
  "Retirement",
  "Other"
];

const InvestmentTracker = () => {
  const { user } = useUser();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);
  const [isEditInvestmentOpen, setIsEditInvestmentOpen] = useState(false);
  
  // Form states
  const [investmentName, setInvestmentName] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investmentROI, setInvestmentROI] = useState("");
  const [investmentType, setInvestmentType] = useState("Stocks");
  const [currentInvestment, setCurrentInvestment] = useState<Investment | null>(null);
  
  useEffect(() => {
    if (user) {
      loadInvestments();
    }
  }, [user]);

  const loadInvestments = () => {
    if (!user) return;
    
    const storedInvestments = localStorage.getItem(`fintrack_investments_${user.id}`);
    if (storedInvestments) {
      setInvestments(JSON.parse(storedInvestments));
    }
  };

  const saveInvestments = (updatedInvestments: Investment[]) => {
    if (!user) return;
    
    localStorage.setItem(`fintrack_investments_${user.id}`, JSON.stringify(updatedInvestments));
    setInvestments(updatedInvestments);
  };

  const handleAddInvestment = () => {
    if (!investmentName || !investmentAmount || !investmentROI) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(investmentAmount);
    const roi = parseFloat(investmentROI);

    if (amount <= 0) {
      toast.error("Investment amount must be greater than zero");
      return;
    }

    const newInvestment: Investment = {
      id: Date.now().toString(),
      name: investmentName,
      amount: amount,
      roi: roi,
      type: investmentType,
      date: new Date().toISOString(),
    };

    const updatedInvestments = [...investments, newInvestment];
    saveInvestments(updatedInvestments);
    
    resetForm();
    setIsAddInvestmentOpen(false);
    toast.success("Investment added successfully!");
  };

  const handleEditInvestment = () => {
    if (!currentInvestment || !investmentName || !investmentAmount || !investmentROI) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(investmentAmount);
    const roi = parseFloat(investmentROI);

    if (amount <= 0) {
      toast.error("Investment amount must be greater than zero");
      return;
    }

    const updatedInvestment: Investment = {
      ...currentInvestment,
      name: investmentName,
      amount: amount,
      roi: roi,
      type: investmentType,
    };

    const updatedInvestments = investments.map((investment) =>
      investment.id === currentInvestment.id ? updatedInvestment : investment
    );
    
    saveInvestments(updatedInvestments);
    setIsEditInvestmentOpen(false);
    toast.success("Investment updated successfully!");
  };

  const handleDeleteInvestment = (id: string) => {
    const updatedInvestments = investments.filter((investment) => investment.id !== id);
    saveInvestments(updatedInvestments);
    toast.success("Investment deleted successfully!");
  };

  const openEditDialog = (investment: Investment) => {
    setCurrentInvestment(investment);
    setInvestmentName(investment.name);
    setInvestmentAmount(investment.amount.toString());
    setInvestmentROI(investment.roi.toString());
    setInvestmentType(investment.type);
    setIsEditInvestmentOpen(true);
  };

  const resetForm = () => {
    setInvestmentName("");
    setInvestmentAmount("");
    setInvestmentROI("");
    setInvestmentType("Stocks");
    setCurrentInvestment(null);
  };

  // Calculate investment metrics
  const totalInvested = investments.reduce((total, inv) => total + inv.amount, 0);
  
  const totalValue = investments.reduce((total, inv) => {
    const currentValue = inv.amount * (1 + inv.roi / 100);
    return total + currentValue;
  }, 0);
  
  const totalGain = totalValue - totalInvested;
  const averageROI = investments.length > 0
    ? investments.reduce((total, inv) => total + inv.roi, 0) / investments.length
    : 0;

  // Group investments by type for summary
  const investmentsByType = investments.reduce((acc, investment) => {
    if (!acc[investment.type]) {
      acc[investment.type] = 0;
    }
    acc[investment.type] += investment.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="animate-fade-in">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investment Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage your investments
          </p>
        </div>
        <Dialog open={isAddInvestmentOpen} onOpenChange={setIsAddInvestmentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Investment</DialogTitle>
              <DialogDescription>
                Enter your investment details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="investment-name">Investment Name</Label>
                <Input
                  id="investment-name"
                  placeholder="Apple Inc. (AAPL)"
                  value={investmentName}
                  onChange={(e) => setInvestmentName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="investment-amount">Invested Amount</Label>
                <Input
                  id="investment-amount"
                  type="number"
                  placeholder="1000.00"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="investment-roi">Return on Investment (%)</Label>
                <Input
                  id="investment-roi"
                  type="number"
                  placeholder="5.5"
                  value={investmentROI}
                  onChange={(e) => setInvestmentROI(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="investment-type">Investment Type</Label>
                <select
                  id="investment-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={investmentType}
                  onChange={(e) => setInvestmentType(e.target.value)}
                >
                  {investmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddInvestment}>Add Investment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Investment Summary */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gain/Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalInvested > 0
                  ? `${((totalGain / totalInvested) * 100).toFixed(2)}%`
                  : '0.00%'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${averageROI >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {averageROI >= 0 ? '+' : ''}{averageROI.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Investment Breakdown by Type */}
      {investments.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Investment Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(investmentsByType).map(([type, amount]) => (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">{formatCurrency(amount)}</div>
                  <p className="text-xs text-muted-foreground">
                    {((amount / totalInvested) * 100).toFixed(1)}% of portfolio
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Investments Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
        {investments.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Invested Amount</TableHead>
                  <TableHead>ROI (%)</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Gain/Loss</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => {
                  const currentValue = investment.amount * (1 + investment.roi / 100);
                  const gainLoss = currentValue - investment.amount;
                  const gainLossPercent = (gainLoss / investment.amount) * 100;
                  
                  return (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.name}</TableCell>
                      <TableCell>{investment.type}</TableCell>
                      <TableCell>{formatCurrency(investment.amount)}</TableCell>
                      <TableCell>{investment.roi}%</TableCell>
                      <TableCell>{formatCurrency(currentValue)}</TableCell>
                      <TableCell>
                        <span className={gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
                          <span className="block text-xs">
                            ({gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(investment)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDeleteInvestment(investment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Card className="text-center p-10">
            <h3 className="text-xl font-semibold mb-4">
              No Investments Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your investments to monitor their performance.
            </p>
            <Button onClick={() => setIsAddInvestmentOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Investment
            </Button>
          </Card>
        )}
      </section>

      {/* Edit Investment Dialog */}
      <Dialog open={isEditInvestmentOpen} onOpenChange={setIsEditInvestmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Investment</DialogTitle>
            <DialogDescription>
              Update your investment details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-investment-name">Investment Name</Label>
              <Input
                id="edit-investment-name"
                placeholder="Apple Inc. (AAPL)"
                value={investmentName}
                onChange={(e) => setInvestmentName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-investment-amount">Invested Amount</Label>
              <Input
                id="edit-investment-amount"
                type="number"
                placeholder="1000.00"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-investment-roi">Return on Investment (%)</Label>
              <Input
                id="edit-investment-roi"
                type="number"
                placeholder="5.5"
                value={investmentROI}
                onChange={(e) => setInvestmentROI(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-investment-type">Investment Type</Label>
              <select
                id="edit-investment-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value)}
              >
                {investmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditInvestment}>Update Investment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

export default InvestmentTracker;


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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

const SavingsTracker = () => {
  const { user } = useUser();
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [isUpdateProgressOpen, setIsUpdateProgressOpen] = useState(false);
  
  // Form states
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialSavedAmount, setInitialSavedAmount] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [currentGoal, setCurrentGoal] = useState<SavingGoal | null>(null);
  
  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = () => {
    if (!user) return;
    
    const storedGoals = localStorage.getItem(`fintrack_savings_${user.id}`);
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  };

  const saveGoals = (updatedGoals: SavingGoal[]) => {
    if (!user) return;
    
    localStorage.setItem(`fintrack_savings_${user.id}`, JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const handleAddGoal = () => {
    if (!goalName || !targetAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const target = parseFloat(targetAmount);
    const initial = parseFloat(initialSavedAmount || "0");

    if (target <= 0) {
      toast.error("Target amount must be greater than zero");
      return;
    }

    if (initial < 0) {
      toast.error("Initial saved amount cannot be negative");
      return;
    }

    const newGoal: SavingGoal = {
      id: Date.now().toString(),
      name: goalName,
      targetAmount: target,
      currentAmount: initial,
      createdAt: new Date().toISOString(),
    };

    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);
    
    resetForm();
    setIsAddGoalOpen(false);
    toast.success("Saving goal added successfully!");
  };

  const handleEditGoal = () => {
    if (!currentGoal || !goalName || !targetAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const target = parseFloat(targetAmount);
    const current = parseFloat(initialSavedAmount || currentGoal.currentAmount.toString());

    if (target <= 0) {
      toast.error("Target amount must be greater than zero");
      return;
    }

    if (current < 0) {
      toast.error("Current amount cannot be negative");
      return;
    }

    const updatedGoal: SavingGoal = {
      ...currentGoal,
      name: goalName,
      targetAmount: target,
      currentAmount: current,
    };

    const updatedGoals = goals.map((goal) =>
      goal.id === currentGoal.id ? updatedGoal : goal
    );
    
    saveGoals(updatedGoals);
    setIsEditGoalOpen(false);
    toast.success("Saving goal updated successfully!");
  };

  const handleUpdateProgress = () => {
    if (!currentGoal || !addAmount) {
      toast.error("Please enter an amount");
      return;
    }

    const amountToAdd = parseFloat(addAmount);

    if (isNaN(amountToAdd)) {
      toast.error("Please enter a valid number");
      return;
    }

    const newAmount = currentGoal.currentAmount + amountToAdd;

    if (newAmount < 0) {
      toast.error("Current amount cannot be negative");
      return;
    }

    const updatedGoal: SavingGoal = {
      ...currentGoal,
      currentAmount: newAmount,
    };

    const updatedGoals = goals.map((goal) =>
      goal.id === currentGoal.id ? updatedGoal : goal
    );
    
    saveGoals(updatedGoals);
    setAddAmount("");
    setIsUpdateProgressOpen(false);
    
    if (newAmount >= currentGoal.targetAmount) {
      toast.success("Congratulations! You've reached your saving goal! 🎉");
    } else {
      toast.success("Progress updated successfully!");
    }
  };

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    saveGoals(updatedGoals);
    toast.success("Saving goal deleted successfully!");
  };

  const openEditDialog = (goal: SavingGoal) => {
    setCurrentGoal(goal);
    setGoalName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setInitialSavedAmount(goal.currentAmount.toString());
    setIsEditGoalOpen(true);
  };

  const openUpdateProgressDialog = (goal: SavingGoal) => {
    setCurrentGoal(goal);
    setAddAmount("");
    setIsUpdateProgressOpen(true);
  };

  const resetForm = () => {
    setGoalName("");
    setTargetAmount("");
    setInitialSavedAmount("");
    setAddAmount("");
    setCurrentGoal(null);
  };

  // Calculate total savings across all goals
  const totalSavings = goals.reduce((total, goal) => total + goal.currentAmount, 0);

  return (
    <div className="animate-fade-in">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Savings Tracker</h1>
          <p className="text-muted-foreground">
            Set and track your savings goals
          </p>
        </div>
        <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Savings Goal</DialogTitle>
              <DialogDescription>
                Set a new goal to save toward.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="New Car"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target-amount">Target Amount</Label>
                <Input
                  id="target-amount"
                  type="number"
                  placeholder="5000.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="initial-amount">
                  Initial Saved Amount (Optional)
                </Label>
                <Input
                  id="initial-amount"
                  type="number"
                  placeholder="0.00"
                  value={initialSavedAmount}
                  onChange={(e) => setInitialSavedAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddGoal}>Add Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Total Savings Card */}
      <section className="mb-8">
        <Card className="bg-gradient-to-r from-savings to-savings/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-background">Total Savings</CardTitle>
            <CardDescription className="text-background/70">
              Across all your goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-background">
              {formatCurrency(totalSavings)}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Savings Goals */}
      <section>
        {goals.length === 0 ? (
          <Card className="text-center p-10">
            <h3 className="text-xl font-semibold mb-4">
              No Savings Goals Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first savings goal to start tracking your progress!
            </p>
            <Button onClick={() => setIsAddGoalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Goal
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <SavingGoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => openEditDialog(goal)}
                onUpdateProgress={() => openUpdateProgressDialog(goal)}
                onDelete={() => handleDeleteGoal(goal.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditGoalOpen} onOpenChange={setIsEditGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Saving Goal</DialogTitle>
            <DialogDescription>
              Update your saving goal details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-goal-name">Goal Name</Label>
              <Input
                id="edit-goal-name"
                placeholder="New Car"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-target-amount">Target Amount</Label>
              <Input
                id="edit-target-amount"
                type="number"
                placeholder="5000.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-current-amount">Current Amount</Label>
              <Input
                id="edit-current-amount"
                type="number"
                placeholder="0.00"
                value={initialSavedAmount}
                onChange={(e) => setInitialSavedAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditGoal}>Update Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Progress Dialog */}
      <Dialog open={isUpdateProgressOpen} onOpenChange={setIsUpdateProgressOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
            <DialogDescription>
              {currentGoal && (
                <>
                  Add to your progress for <strong>{currentGoal.name}</strong>.
                  Current: {formatCurrency(currentGoal.currentAmount)} of{" "}
                  {formatCurrency(currentGoal.targetAmount)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-amount">
                Amount to Add (use negative for withdrawal)
              </Label>
              <Input
                id="add-amount"
                type="number"
                placeholder="100.00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateProgress}>Update Progress</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface SavingGoalCardProps {
  goal: SavingGoal;
  onEdit: () => void;
  onUpdateProgress: () => void;
  onDelete: () => void;
}

const SavingGoalCard = ({
  goal,
  onEdit,
  onUpdateProgress,
  onDelete,
}: SavingGoalCardProps) => {
  // Calculate progress percentage
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isComplete = progress >= 100;

  return (
    <Card className={isComplete ? "border-savings" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{goal.name}</CardTitle>
            <CardDescription>
              {isComplete ? "Goal reached! 🎉" : "In progress..."}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm font-medium">
            <span>Progress</span>
            <span>{Math.min(progress, 100).toFixed(0)}%</span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="font-semibold">{formatCurrency(goal.currentAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Target</p>
            <p className="font-semibold">{formatCurrency(goal.targetAmount)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onUpdateProgress}
          variant="outline"
          className="w-full"
        >
          Update Progress
        </Button>
      </CardFooter>
    </Card>
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

export default SavingsTracker;

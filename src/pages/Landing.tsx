
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, PieChart, TrendingUp, PiggyBank, Shield } from "lucide-react";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">FinTrack</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Take Control of Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Financial Future
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Track expenses, set savings goals, monitor investments, and gain insights 
            into your financial health—all in one place.
          </p>
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg gap-2"
            onClick={() => navigate('/auth')}
          >
            Get Started <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Financial Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Wallet className="h-10 w-10 text-primary" />}
              title="Expense Tracking"
              description="Easily log and categorize your daily expenses to understand where your money goes."
            />
            <FeatureCard 
              icon={<PiggyBank className="h-10 w-10 text-savings" />}
              title="Savings Goals"
              description="Set financial goals and track your progress with visual indicators."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-10 w-10 text-investment" />}
              title="Investment Monitoring"
              description="Track the performance of your investments and see your wealth grow."
            />
            <FeatureCard 
              icon={<PieChart className="h-10 w-10 text-expense" />}
              title="Financial Insights"
              description="Get visual breakdowns of your spending habits and financial trends."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <StepCard 
            step="1"
            title="Track Your Expenses"
            description="Log your daily expenses and categorize them to understand your spending habits."
          />
          <StepCard 
            step="2"
            title="Set Financial Goals"
            description="Create savings goals and monitor your progress toward achieving them."
          />
          <StepCard 
            step="3"
            title="Gain Financial Insights"
            description="Visualize your financial data and make informed decisions about your money."
          />
        </div>
      </section>

      {/* Security */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Your Data Stays Private</h2>
          <p className="text-lg text-muted-foreground mb-6">
            All your financial information is stored locally on your device.
            We never send your personal data to any server.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Financial Life?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who've taken control of their finances with FinTrack.
          </p>
          <Button 
            size="lg" 
            className="px-8 gap-2"
            onClick={() => navigate('/auth')}
          >
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-bold">FinTrack</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  return (
    <div className="card flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const StepCard = ({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {step}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;

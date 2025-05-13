
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialTips = () => {
  return (
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
  );
};

export default FinancialTips;

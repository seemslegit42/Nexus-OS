import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChartBig, Cpu, FileText, ShoppingCart, Download } from 'lucide-react';
import Image from 'next/image';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer } from "recharts"

const costData = [
  { month: 'Jan', cost: 250 }, { month: 'Feb', cost: 280 }, { month: 'Mar', cost: 320 },
  { month: 'Apr', cost: 300 }, { month: 'May', cost: 350 }, { month: 'Jun', cost: 400 },
];
const agentConsumptionData = [
  { agent: 'OptimizerPrime', tokens: 150000, compute: 25 },
  { agent: 'DataMinerX', tokens: 80000, compute: 15 },
  { agent: 'SecureGuard', tokens: 250000, compute: 40 },
];

const chartConfig = {
  cost: { label: "Cost ($)", color: "hsl(var(--chart-1))" },
  tokens: { label: "Tokens", color: "hsl(var(--chart-2))" },
  compute: { label: "Compute (hrs)", color: "hsl(var(--chart-3))" },
}

export default function BillingPage() {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Zone title="Cost Over Time" icon={<BarChartBig className="w-5 h-5" />} className="lg:col-span-2">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <RechartsTooltip
                cursor={{ fill: "hsl(var(--accent))", opacity: 0.3 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <RechartsLegend content={<ChartLegendContent />} />
              <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Zone>

      <Zone title="Current Plan & Usage" icon={<ShoppingCart className="w-5 h-5" />}>
        <Card className="bg-background/50 shadow-none">
          <CardHeader>
            <CardTitle className="font-headline text-primary">Pro Plan</CardTitle>
            <CardDescription>$99/month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Token Usage</span>
                <span className="font-medium text-foreground">480k / 1M</span>
              </div>
              <Progress value={48} className="h-2 [&>div]:bg-primary" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Compute Hours</span>
                <span className="font-medium text-foreground">80 / 200</span>
              </div>
              <Progress value={40} className="h-2 [&>div]:bg-chart-2" />
            </div>
            <Button variant="outline" className="w-full">Manage Subscription</Button>
          </CardContent>
        </Card>
      </Zone>

      <Zone title="Agent Resource Consumption" icon={<Cpu className="w-5 h-5" />} className="lg:col-span-3">
         <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentConsumptionData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="agent" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
              <RechartsTooltip
                cursor={{ fill: "hsl(var(--accent))", opacity: 0.3 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <RechartsLegend content={<ChartLegendContent />} />
              <Bar dataKey="tokens" stackId="a" fill="var(--color-tokens)" radius={[0, 4, 4, 0]} barSize={20} />
              <Bar dataKey="compute" stackId="a" fill="var(--color-compute)" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Zone>
      
      <Zone title="Billing History" icon={<FileText className="w-5 h-5" />} className="lg:col-span-3">
        <div className="space-y-2">
            {[
                {id: "INV-2023-003", date: "October 1, 2023", amount: "$99.00", status: "Paid"},
                {id: "INV-2023-002", date: "September 1, 2023", amount: "$99.00", status: "Paid"},
                {id: "INV-2023-001", date: "August 1, 2023", amount: "$99.00", status: "Paid"},
            ].map(invoice => (
                <div key={invoice.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                    <div>
                        <p className="font-medium text-foreground">{invoice.id}</p>
                        <p className="text-xs text-muted-foreground">{invoice.date} - {invoice.amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={invoice.status === "Paid" ? "default" : "destructive"} className={invoice.status === "Paid" ? "bg-green-500/80 text-white" : ""}>{invoice.status}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4"/></Button>
                    </div>
                </div>
            ))}
        </div>
      </Zone>
    </div>
  );
}

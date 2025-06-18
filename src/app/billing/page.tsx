// src/app/billing/page.tsx
'use client';

import type { ReactNode } from 'react';
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/lib/icons';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const costData = [
  { month: 'Jan', cost: 250 },
  { month: 'Feb', cost: 280 },
  { month: 'Mar', cost: 320 },
  { month: 'Apr', cost: 300 },
  { month: 'May', cost: 350 },
  { month: 'Jun', cost: 400 },
];
const agentConsumptionData = [
  { agent: 'OptimizerPrime', tokens: 150000, compute: 25 },
  { agent: 'DataMinerX', tokens: 80000, compute: 15 },
  { agent: 'SecureGuard', tokens: 250000, compute: 40 },
];

const chartConfig = {
  cost: { label: 'Cost ($)', color: 'hsl(var(--chart-1))' },
  tokens: { label: 'Tokens', color: 'hsl(var(--chart-2))' },
  compute: { label: 'Compute (hrs)', color: 'hsl(var(--chart-3))' },
};

function CostOverTimeContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardContent className="flex-grow p-1 md:p-2">
        <ChartContainer
          config={chartConfig}
          className="h-full min-h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={costData}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.2 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <RechartsLegend content={<ChartLegendContent />} />
              <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CurrentPlanUsageContent(): ReactNode {
  return (
    <Card className="h-full border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="font-headline text-primary">Pro Plan</CardTitle>
        <CardDescription className="text-xs">$99/month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-2 md:p-3">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">Token Usage</span>
            <span className="font-medium text-foreground">480k / 1M</span>
          </div>
          <Progress value={48} className="h-2 [&>div]:bg-primary" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">Compute Hours</span>
            <span className="font-medium text-foreground">80 / 200</span>
          </div>
          <Progress value={40} className="h-2 [&>div]:bg-chart-2" />
        </div>
        <Button variant="outline" className="w-full bg-card hover:bg-muted/60">
          Manage Subscription
        </Button>
      </CardContent>
    </Card>
  );
}

function AgentResourceConsumptionContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardContent className="flex-grow p-1 md:p-2">
        <ChartContainer
          config={chartConfig}
          className="h-full min-h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={agentConsumptionData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="agent"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={100}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.2 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <RechartsLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="tokens"
                stackId="a"
                fill="var(--color-tokens)"
                radius={[0, 4, 4, 0]}
                barSize={16}
              />
              <Bar
                dataKey="compute"
                stackId="a"
                fill="var(--color-compute)"
                radius={[0, 4, 4, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function BillingHistoryContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardContent className="flex-grow overflow-hidden p-1 md:p-2">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-0.5">
            {[
              {
                id: 'INV-2023-003',
                date: 'October 1, 2023',
                amount: '$99.00',
                status: 'Paid',
              },
              {
                id: 'INV-2023-002',
                date: 'September 1, 2023',
                amount: '$99.00',
                status: 'Paid',
              },
              {
                id: 'INV-2023-001',
                date: 'August 1, 2023',
                amount: '$99.00',
                status: 'Paid',
              },
            ].map(invoice => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-md border border-border/60 bg-card p-2.5 shadow-sm"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {invoice.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.date} - {invoice.amount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      invoice.status === 'Paid' ? 'default' : 'destructive'
                    }
                    className={
                      invoice.status === 'Paid'
                        ? 'h-5 bg-green-500/80 px-2 py-0.5 text-xs text-white'
                        : 'h-5 px-2 py-0.5 text-xs'
                    }
                  >
                    {invoice.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default function BillingPage() {
  const billingPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'costOverTime',
      title: 'Cost Over Time',
      icon: <BarChartBig className="h-4 w-4" />,
      content: <CostOverTimeContent />,
      defaultLayout: { x: 0, y: 0, w: 8, h: 9, minW: 4, minH: 6 },
    },
    {
      id: 'currentPlanUsage',
      title: 'Current Plan & Usage',
      icon: <ShoppingCart className="h-4 w-4" />,
      content: <CurrentPlanUsageContent />,
      defaultLayout: { x: 8, y: 0, w: 4, h: 9, minW: 3, minH: 6 },
    },
    {
      id: 'agentResourceConsumption',
      title: 'Agent Resource Consumption',
      icon: <Cpu className="h-4 w-4" />,
      content: <AgentResourceConsumptionContent />,
      defaultLayout: { x: 0, y: 9, w: 12, h: 10, minW: 6, minH: 6 },
    },
    {
      id: 'billingHistory',
      title: 'Billing History',
      icon: <FileText className="h-4 w-4" />,
      content: <BillingHistoryContent />,
      defaultLayout: { x: 0, y: 19, w: 12, h: 8, minW: 6, minH: 5 },
    },
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={billingPageZoneConfigs}
      className="flex-grow p-1 md:p-2"
    />
  );
}

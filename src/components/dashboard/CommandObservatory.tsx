// src/components/dashboard/CommandObservatory.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Zap, ShieldAlert, Activity, BarChart2, Settings, Eye, LayoutGrid, Command as CommandIcon } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColorClass?: string;
}

const MetricDisplay: React.FC<MetricProps> = ({ icon, label, value, bgColorClass = 'bg-card/70' }) => (
  <div className={`p-3 rounded-xl border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all ${bgColorClass} backdrop-blur-sm`}>
    <div className="flex items-center gap-2 mb-1">
      {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 text-primary" })}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="text-xl font-semibold text-foreground">{value}</p>
  </div>
);

interface AchievementProps {
  icon: React.ReactNode;
  text: string;
  time: string;
}

const AchievementItem: React.FC<AchievementProps> = ({ icon, text, time }) => (
  <div className="flex items-start gap-3 p-2.5 rounded-lg border border-primary/15 bg-card/50 hover:bg-muted/20 transition-colors">
    {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" })}
    <div>
      <p className="text-sm text-foreground">{text}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  </div>
);

export default function CommandObservatory() {
  const automatedTasksToday = "1,842";
  const proactiveAlertsHandled = "23";
  const efficiencyGain = "+18%";

  const recentAchievements = [
    { icon: <Zap />, text: "Customer data synchronization across 5 platforms completed seamlessly.", time: "27 minutes ago" },
    { icon: <ShieldAlert />, text: "Automated security protocol update deployed successfully to all agents.", time: "2 hours ago" },
    { icon: <BarChart2 />, text: "Quarterly sales report generated and distributed ahead of schedule.", time: "5 hours ago" },
    { icon: <Settings />, text: "System performance self-optimization cycle completed with zero downtime.", time: "8 hours ago"},
  ];

  return (
    <Card className="w-full h-full flex flex-col max-w-4xl mx-auto overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-1">
          <Eye className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl md:text-3xl font-headline text-foreground">
              Automation Overwatch
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Observe the silent efficiency of your NexOS automated ecosystem.
            </CardDescription>
          </div>
        </div>
         <div className="flex items-center gap-2 text-sm text-green-400 pt-2">
            <CheckCircle className="h-5 w-5" />
            <span>System Status: All Operations Nominal & Efficient</span>
        </div>
      </CardHeader>

      <ScrollArea className="flex-grow">
        <CardContent className="pt-0 pb-4 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Key Automation Metrics (Last 24h)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MetricDisplay icon={<Zap />} label="Tasks Automated" value={automatedTasksToday} />
              <MetricDisplay icon={<ShieldAlert />} label="Proactive Alerts Handled" value={proactiveAlertsHandled} />
              <MetricDisplay icon={<Activity />} label="Productivity Boost" value={efficiencyGain} />
            </div>
          </section>

          <Separator className="my-4 border-primary/20" />

          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Recent Silent Achievements</h3>
            <div className="space-y-2.5">
              {recentAchievements.map((ach, index) => (
                <AchievementItem key={index} icon={ach.icon} text={ach.text} time={ach.time} />
              ))}
            </div>
          </section>
        </CardContent>
      </ScrollArea>

      <CardFooter className="pt-4 border-t border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          NexOS is autonomously managing your workflows.
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/loom-studio">
              <LayoutGrid className="mr-2 h-3.5 w-3.5" /> Design Workflows
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/command">
              <CommandIcon className="mr-2 h-3.5 w-3.5" /> Issue Directives
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

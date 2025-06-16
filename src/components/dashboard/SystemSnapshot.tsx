// src/components/dashboard/SystemSnapshot.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Cpu, Database, AlertTriangle, ShieldCheck, Zap, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Metric {
  value: number;
  label: string;
  unit: string;
  icon: React.ReactNode;
  colorClass: string; // Tailwind color class for progress bar
}

const initialMetrics: Metric[] = [
  { value: 35, label: "CPU Load", unit: "%", icon: <Cpu className="h-3.5 w-3.5" />, colorClass: "bg-chart-1" },
  { value: 60, label: "Memory Usage", unit: "%", icon: <Database className="h-3.5 w-3.5" />, colorClass: "bg-chart-2" },
  { value: 12, label: "Active Tasks", unit: "", icon: <Zap className="h-3.5 w-3.5" />, colorClass: "bg-chart-3" },
  { value: 98, label: "Security Score", unit: "/100", icon: <ShieldCheck className="h-3.5 w-3.5" />, colorClass: "bg-green-500" },
  { value: 2, label: "System Alerts", unit: "", icon: <AlertTriangle className="h-3.5 w-3.5" />, colorClass: "bg-yellow-500" },
];

const SystemSnapshot: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prevMetrics =>
        prevMetrics.map(metric => {
          let newValue = metric.value;
          if (metric.label === "CPU Load" || metric.label === "Memory Usage") {
            newValue = Math.max(10, Math.min(95, metric.value + Math.floor(Math.random() * 21) - 10)); // Fluctuate between 10-95
          } else if (metric.label === "Active Tasks") {
            newValue = Math.max(0, metric.value + Math.floor(Math.random() * 5) - 2); // Fluctuate tasks
          } else if (metric.label === "Security Score") {
            newValue = Math.max(70, Math.min(100, metric.value + Math.floor(Math.random() * 5) - 2)); // Keep score high
          } else if (metric.label === "System Alerts") {
            newValue = Math.random() > 0.8 ? Math.floor(Math.random() * 5) : metric.value; // Occasionally change alerts
          }
          return { ...metric, value: newValue };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <Activity className="h-4 w-4 mr-2 text-primary" /> System Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-2.5">
        {metrics.map(metric => (
          <div key={metric.label} className="text-xs">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-muted-foreground flex items-center gap-1.5">
                {React.cloneElement(metric.icon, { className: cn(metric.icon.props.className, "text-muted-foreground/80")})}
                {metric.label}
              </span>
              <span className={cn("font-medium", metric.label === "Security Score" && metric.value >=90 ? "text-green-400" : metric.label === "System Alerts" && metric.value > 0 ? "text-yellow-400" : "text-foreground")}>
                {metric.value}{metric.unit}
              </span>
            </div>
            <Progress value={metric.label === "Security Score" ? metric.value : metric.value} className={cn("h-1.5", metric.label === "System Alerts" && metric.value > 0 ? "[&>div]:bg-yellow-500" : metric.label === "Security Score" && metric.value < 80 ? "[&>div]:bg-orange-500" : `[&>div]:${metric.colorClass}`)} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SystemSnapshot;

// src/components/dashboard/SystemSnapshot.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Cpu, Database, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Metric {
  value: number;
  label: string;
  unit: string;
  icon: React.ReactNode;
  colorClass: string; 
  threshold?: { warn: number; error: number }; 
}

const initialMetrics: Metric[] = [
  { value: 35, label: "CPU Load", unit: "%", icon: <Cpu className="h-3.5 w-3.5" />, colorClass: "bg-chart-1", threshold: { warn: 70, error: 90 } },
  { value: 60, label: "Memory Usage", unit: "%", icon: <Database className="h-3.5 w-3.5" />, colorClass: "bg-chart-2", threshold: { warn: 75, error: 90 } },
  { value: 12, label: "Active Tasks", unit: "", icon: <Zap className="h-3.5 w-3.5" />, colorClass: "bg-chart-3" },
  { value: 98, label: "Security Score", unit: "/100", icon: <ShieldCheck className="h-3.5 w-3.5" />, colorClass: "bg-green-500", threshold: { warn: 80, error: 60 } }, 
  { value: 2, label: "System Alerts", unit: "", icon: <AlertTriangle className="h-3.5 w-3.5" />, colorClass: "bg-yellow-500", threshold: { warn: 3, error: 5 } },
];

const SystemSnapshot: React.FC = () => {
  // Metrics are now static, representing a snapshot fetched from a backend.
  // Real-time updates would come via props, context, or a data fetching library.
  const metrics: Metric[] = initialMetrics;
  
  const getMetricStyling = (metric: Metric) => {
    let progressClass = `[&>div]:${metric.colorClass}`;
    let textClass = "text-foreground";

    if (metric.threshold) {
      const isScore = metric.label === "Security Score";
      if ((isScore && metric.value < metric.threshold.error) || (!isScore && metric.value >= metric.threshold.error)) {
        progressClass = "[&>div]:bg-destructive";
        textClass = "text-destructive font-bold";
      } else if ((isScore && metric.value < metric.threshold.warn) || (!isScore && metric.value >= metric.threshold.warn)) {
        progressClass = "[&>div]:bg-yellow-500";
        textClass = "text-yellow-500 dark:text-yellow-400 font-semibold";
      } else if (isScore) {
        progressClass = "[&>div]:bg-green-500";
        textClass = "text-green-400";
      }
    }
    return { progressClass, textClass };
  };


  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <Activity className="h-4 w-4 mr-2 text-primary" /> System Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-2.5">
        {metrics.map(metric => {
          const { progressClass, textClass } = getMetricStyling(metric);
          return (
            <div key={metric.label} className="text-xs">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  {React.cloneElement(metric.icon, { className: cn(metric.icon.props.className, "text-muted-foreground/80")})}
                  {metric.label}
                </span>
                <span className={cn("font-medium", textClass)}>
                  {metric.value}{metric.unit}
                </span>
              </div>
              <Progress value={metric.label === "Security Score" ? metric.value : (metric.label === "System Alerts" ? (metric.value / (metric.threshold?.error || 5)) * 100 : metric.value)} className={cn("h-1.5", progressClass)} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default React.memo(SystemSnapshot);

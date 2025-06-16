
// src/components/dashboard/SystemSnapshot.tsx
'use client';

import React from 'react'; // Removed useState, useEffect as data is now static
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Cpu, Database, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Metric {
  value: number;
  label: string;
  unit: string;
  icon: React.ReactNode;
  // colorClass is now determined by status below
  threshold?: { warn: number; error: number }; 
}

// Data is now static, representing a snapshot from a backend.
const initialMetrics: Metric[] = [
  { value: 35, label: "CPU Load", unit: "%", icon: <Cpu className="h-3.5 w-3.5" />, threshold: { warn: 70, error: 90 } },
  { value: 60, label: "Memory Usage", unit: "%", icon: <Database className="h-3.5 w-3.5" />, threshold: { warn: 75, error: 90 } },
  { value: 12, label: "Active Tasks", unit: "", icon: <Zap className="h-3.5 w-3.5" /> },
  { value: 98, label: "Security Score", unit: "/100", icon: <ShieldCheck className="h-3.5 w-3.5" />, threshold: { warn: 80, error: 60 } }, 
  { value: 2, label: "System Alerts", unit: "", icon: <AlertTriangle className="h-3.5 w-3.5" />, threshold: { warn: 3, error: 5 } },
];

const SystemSnapshot: React.FC = () => {
  const metrics: Metric[] = initialMetrics;
  
  const getMetricStyling = (metric: Metric) => {
    let progressColorVar = 'var(--accent-primary-color)';
    let textColorClass = 'text-text-primary-custom';
    let fontWeightClass = 'font-weight-regular';

    if (metric.threshold) {
      const isScore = metric.label === "Security Score";
      if ((isScore && metric.value < metric.threshold.error) || (!isScore && metric.value >= metric.threshold.error)) {
        progressColorVar = 'var(--status-error-color)';
        textColorClass = 'text-[var(--status-error-color)]';
        fontWeightClass = 'font-weight-bold';
      } else if ((isScore && metric.value < metric.threshold.warn) || (!isScore && metric.value >= metric.threshold.warn)) {
        progressColorVar = 'var(--status-in-progress-color)'; // Using 'in-progress' for warning as per new tokens
        textColorClass = 'text-[var(--status-in-progress-color)]';
        fontWeightClass = 'font-weight-bold'; // Bold for warning too
      } else if (isScore) {
        progressColorVar = 'var(--status-success-color)';
        textColorClass = 'text-[var(--status-success-color)]';
      }
    }
    return { progressColorVar, textColorClass, fontWeightClass };
  };

  return (
    // The Card component itself will pick up the new panel-glass styles from globals.css
    // via its own refactoring.
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardHeader className="pb-space-xs pt-space-sm px-space-sm"> {/* Use spacing tokens */}
        <CardTitle className="text-size-base font-headline font-weight-bold text-text-primary-custom flex items-center"> {/* Use new font tokens */}
          <Activity className="h-4 w-4 mr-space-xs text-[var(--accent-primary-color)]" /> {/* Use tokens */}
          System Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent className="px-space-sm pb-space-sm space-y-space-xs"> {/* Use spacing tokens */}
        {metrics.map(metric => {
          const { progressColorVar, textColorClass, fontWeightClass } = getMetricStyling(metric);
          const progressValue = metric.label === "Security Score" 
            ? metric.value 
            : metric.label === "System Alerts" 
            ? (metric.value / (metric.threshold?.error || 5)) * 100 
            : metric.value;

          return (
            <div key={metric.label} className="text-size-small"> {/* Use font size token */}
              <div className="flex justify-between items-center mb-space-xs">
                <span className="text-text-secondary-custom flex items-center gap-space-xs"> {/* Use tokens */}
                  {React.cloneElement(metric.icon, { className: cn(metric.icon.props.className, "text-text-secondary-custom opacity-80")})}
                  {metric.label}
                </span>
                <span className={cn("font-medium", textColorClass, fontWeightClass)}>
                  {metric.value}{metric.unit}
                </span>
              </div>
              <Progress 
                value={progressValue} 
                className="h-1.5" // Keep small height for progress
                style={{ '--progress-indicator-color': progressColorVar } as React.CSSProperties} 
                // Custom property to control indicator color due to Tailwind's dynamic class limitations
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

// Add style for custom progress bar color to globals.css or a style tag if it's simpler for one component
// For SystemSnapshot, since Progress component is used, we need to adjust its styling.
// The Progress component uses `bg-primary` for its indicator. We can either:
// 1. Override .bg-primary locally for this component (not ideal).
// 2. Pass a style prop if Progress supports it.
// 3. Add variant to Progress (more involved).
// Let's use a CSS variable passed via style prop for the indicator color.
// The Progress component should be updated to accept this.
// The provided `Progress` component uses `bg-primary` for the indicator.
// I'll update `src/components/ui/progress.tsx` to use a CSS variable for the indicator.

export default React.memo(SystemSnapshot);

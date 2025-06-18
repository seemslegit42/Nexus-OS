// src/components/dashboard/SystemMetrics.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Cpu,
  HardDrives as Database,
  CloudArrowUp as CloudUpload,
  Lightning,
  Activity,
  TrendUp,
  Users,
  Robot,
  Timer,
  ChartBar,
} from '@phosphor-icons/react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  gradient: string;
  subtext?: string;
  progress?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  gradient,
  subtext,
  progress,
}) => {
  const [mounted, setMounted] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Animate the value
    const numValue =
      typeof value === 'string'
        ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0
        : value;
    const timer = setTimeout(() => {
      setAnimatedValue(numValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden border-0 transition-all duration-500 hover:scale-105',
        'bg-gradient-to-br backdrop-blur-md',
        gradient,
        'shadow-lg hover:shadow-2xl hover:shadow-primary/20'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-white/5 transition-transform duration-700 group-hover:scale-150" />

      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm transition-colors group-hover:bg-white/20">
              {icon}
            </div>
            <CardTitle className="text-sm font-medium text-white/90 transition-colors group-hover:text-white">
              {title}
            </CardTitle>
          </div>
          {change && (
            <Badge
              variant="secondary"
              className={cn(
                'border-0 bg-white/10 text-xs font-medium',
                getChangeColor()
              )}
            >
              {change}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-0">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-white transition-colors group-hover:text-white/95">
            {mounted ? (
              <div className="transition-all duration-1000 ease-out">
                {typeof value === 'string'
                  ? value
                  : animatedValue.toLocaleString()}
              </div>
            ) : (
              <div className="opacity-0">0</div>
            )}
          </div>
          {subtext && (
            <p className="text-xs text-white/70 transition-colors group-hover:text-white/80">
              {subtext}
            </p>
          )}
          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} className="h-1.5 bg-white/20" />
              <div className="text-right text-xs text-white/60">
                {progress}%
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const SystemMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    activeAgents: 0,
    totalOrchestrations: 0,
    systemUptime: 0,
    avgResponseTime: 0,
  });

  // Simulate real-time metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(
          20,
          Math.min(85, prev.cpuUsage + (Math.random() - 0.5) * 10)
        ),
        memoryUsage: Math.max(
          30,
          Math.min(75, prev.memoryUsage + (Math.random() - 0.5) * 8)
        ),
        activeAgents: Math.max(
          3,
          Math.min(
            12,
            Math.round(prev.activeAgents + (Math.random() - 0.5) * 2)
          )
        ),
        totalOrchestrations:
          prev.totalOrchestrations + Math.round(Math.random() * 3),
        systemUptime: prev.systemUptime + 1,
        avgResponseTime: Math.max(
          50,
          Math.min(300, prev.avgResponseTime + (Math.random() - 0.5) * 20)
        ),
      }));
    }, 2000);

    // Initial values
    setMetrics({
      cpuUsage: 45,
      memoryUsage: 62,
      activeAgents: 8,
      totalOrchestrations: 1247,
      systemUptime: 72,
      avgResponseTime: 120,
    });

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  return (
    <Card className="h-full border-none bg-transparent shadow-none">
      <CardHeader className="px-3 pb-3 pt-3">
        <CardTitle className="flex items-center text-base font-medium text-foreground">
          <Activity className="mr-2 h-4 w-4 text-primary" />
          System Metrics
          <div className="ml-auto flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-3 pb-3">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="CPU Usage"
            value={`${Math.round(metrics.cpuUsage)}%`}
            change="+2.3%"
            changeType="positive"
            icon={<Cpu className="h-4 w-4 text-white" />}
            gradient="from-blue-600/80 to-purple-600/80"
            progress={metrics.cpuUsage}
          />

          <MetricCard
            title="Memory"
            value={`${Math.round(metrics.memoryUsage)}%`}
            change="-1.1%"
            changeType="positive"
            icon={<Database className="h-4 w-4 text-white" />}
            gradient="from-green-600/80 to-emerald-600/80"
            progress={metrics.memoryUsage}
          />

          <MetricCard
            title="Active Agents"
            value={metrics.activeAgents}
            change="+1"
            changeType="positive"
            icon={<Robot className="h-4 w-4 text-white" />}
            gradient="from-orange-600/80 to-red-600/80"
            subtext="Deployed & Running"
          />

          <MetricCard
            title="Orchestrations"
            value={metrics.totalOrchestrations.toLocaleString()}
            change="+12"
            changeType="positive"
            icon={<Lightning className="h-4 w-4 text-white" />}
            gradient="from-purple-600/80 to-pink-600/80"
            subtext="Total Executed"
          />

          <MetricCard
            title="Uptime"
            value={formatUptime(metrics.systemUptime)}
            changeType="positive"
            icon={<Timer className="h-4 w-4 text-white" />}
            gradient="from-cyan-600/80 to-blue-600/80"
            subtext="System Availability"
          />

          <MetricCard
            title="Response Time"
            value={`${Math.round(metrics.avgResponseTime)}ms`}
            change="-5ms"
            changeType="positive"
            icon={<TrendUp className="h-4 w-4 text-white" />}
            gradient="from-indigo-600/80 to-purple-600/80"
            subtext="Average Latency"
          />
        </div>
      </CardContent>
    </Card>
  );
};

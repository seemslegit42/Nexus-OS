// src/components/dashboard/PerformanceDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  ChartBar,
  TrendUp,
  Lightning,
  Clock,
  CheckCircle,
  XCircle,
  Warning,
} from '@phosphor-icons/react';

interface ChartDataPoint {
  time: string;
  value: number;
  status?: 'success' | 'warning' | 'error';
}

const MiniChart: React.FC<{
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  animated?: boolean;
}> = ({ data, height = 60, color = '#10b981', animated = true }) => {
  const [animatedData, setAnimatedData] = useState(
    data.map(d => ({ ...d, value: 0 }))
  );

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedData(data);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data);
    }
  }, [data, animated]);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="relative" style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 60"
        className="overflow-visible"
      >
        <defs>
          <linearGradient
            id={`gradient-${color}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* Area under curve */}
        <path
          d={`M 0 60 ${animatedData
            .map((point, index) => {
              const x = (index / (animatedData.length - 1)) * 200;
              const y = 60 - ((point.value - minValue) / range) * 50;
              return `L ${x} ${y}`;
            })
            .join(' ')} L 200 60 Z`}
          fill={`url(#gradient-${color})`}
          className="transition-all duration-1000 ease-out"
        />

        {/* Line */}
        <path
          d={`M ${animatedData
            .map((point, index) => {
              const x = (index / (animatedData.length - 1)) * 200;
              const y = 60 - ((point.value - minValue) / range) * 50;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ')}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />

        {/* Data points */}
        {animatedData.map((point, index) => {
          const x = (index / (animatedData.length - 1)) * 200;
          const y = 60 - ((point.value - minValue) / range) * 50;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              className="hover:r-3 opacity-80 transition-all duration-1000 ease-out hover:opacity-100"
            />
          );
        })}
      </svg>
    </div>
  );
};

const PerformanceCard: React.FC<{
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  icon: React.ReactNode;
  data: ChartDataPoint[];
  color: string;
  bgGradient: string;
}> = ({ title, value, trend, trendValue, icon, data, color, bgGradient }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendUp className="h-3 w-3 text-green-400" />;
      case 'down':
        return <TrendUp className="h-3 w-3 rotate-180 text-red-400" />;
      default:
        return <div className="h-3 w-3 rounded-full bg-yellow-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden border-0 transition-all duration-500',
        'bg-gradient-to-br shadow-lg backdrop-blur-md hover:shadow-2xl',
        bgGradient,
        isHovered && 'scale-105'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-md bg-white/15 p-1.5 backdrop-blur-sm">
              {icon}
            </div>
            <CardTitle className="text-sm font-medium text-white/90">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={cn('text-xs font-medium', getTrendColor())}>
              {trendValue}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pb-3 pt-0">
        <div className="space-y-3">
          <div className="text-xl font-bold text-white">{value}</div>
          <MiniChart data={data} color={color} height={40} />
        </div>
      </CardContent>
    </Card>
  );
};

export const PerformanceDashboard: React.FC = () => {
  const [performanceData, setPerformanceData] = useState({
    responseTime: [] as ChartDataPoint[],
    throughput: [] as ChartDataPoint[],
    errorRate: [] as ChartDataPoint[],
    activeConnections: [] as ChartDataPoint[],
  });

  const [currentMetrics, setCurrentMetrics] = useState({
    responseTime: 125,
    throughput: 2847,
    errorRate: 0.3,
    activeConnections: 1429,
  });

  // Generate realistic performance data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const dataPoints = 15;

      const responseTimeData = Array.from({ length: dataPoints }, (_, i) => ({
        time: new Date(
          now.getTime() - (dataPoints - i) * 60000
        ).toLocaleTimeString(),
        value: 100 + Math.random() * 50 + Math.sin(i * 0.5) * 20,
      }));

      const throughputData = Array.from({ length: dataPoints }, (_, i) => ({
        time: new Date(
          now.getTime() - (dataPoints - i) * 60000
        ).toLocaleTimeString(),
        value: 2500 + Math.random() * 800 + Math.cos(i * 0.3) * 300,
      }));

      const errorRateData = Array.from({ length: dataPoints }, (_, i) => ({
        time: new Date(
          now.getTime() - (dataPoints - i) * 60000
        ).toLocaleTimeString(),
        value: Math.max(0, 0.2 + Math.random() * 0.4),
      }));

      const connectionsData = Array.from({ length: dataPoints }, (_, i) => ({
        time: new Date(
          now.getTime() - (dataPoints - i) * 60000
        ).toLocaleTimeString(),
        value: 1200 + Math.random() * 500 + Math.sin(i * 0.4) * 200,
      }));

      setPerformanceData({
        responseTime: responseTimeData,
        throughput: throughputData,
        errorRate: errorRateData,
        activeConnections: connectionsData,
      });

      setCurrentMetrics({
        responseTime: responseTimeData[responseTimeData.length - 1].value,
        throughput: throughputData[throughputData.length - 1].value,
        errorRate: errorRateData[errorRateData.length - 1].value,
        activeConnections: connectionsData[connectionsData.length - 1].value,
      });
    };

    generateData();
    const interval = setInterval(generateData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full border-none bg-transparent shadow-none">
      <CardHeader className="px-3 pb-3 pt-3">
        <CardTitle className="flex items-center text-base font-medium text-foreground">
          <ChartBar className="mr-2 h-4 w-4 text-primary" />
          Performance Analytics
          <div className="ml-auto flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-3 pb-3">
        <div className="grid grid-cols-2 gap-3">
          <PerformanceCard
            title="Response Time"
            value={`${Math.round(currentMetrics.responseTime)}ms`}
            trend="down"
            trendValue="-8ms"
            icon={<Clock className="h-4 w-4 text-white" />}
            data={performanceData.responseTime}
            color="#10b981"
            bgGradient="from-emerald-600/80 to-green-600/80"
          />

          <PerformanceCard
            title="Throughput"
            value={`${Math.round(currentMetrics.throughput)}/min`}
            trend="up"
            trendValue="+247"
            icon={<Lightning className="h-4 w-4 text-white" />}
            data={performanceData.throughput}
            color="#3b82f6"
            bgGradient="from-blue-600/80 to-indigo-600/80"
          />

          <PerformanceCard
            title="Error Rate"
            value={`${currentMetrics.errorRate.toFixed(2)}%`}
            trend="down"
            trendValue="-0.1%"
            icon={<Warning className="h-4 w-4 text-white" />}
            data={performanceData.errorRate}
            color="#f59e0b"
            bgGradient="from-yellow-600/80 to-orange-600/80"
          />

          <PerformanceCard
            title="Connections"
            value={Math.round(
              currentMetrics.activeConnections
            ).toLocaleString()}
            trend="up"
            trendValue="+23"
            icon={<CheckCircle className="h-4 w-4 text-white" />}
            data={performanceData.activeConnections}
            color="#8b5cf6"
            bgGradient="from-purple-600/80 to-violet-600/80"
          />
        </div>
      </CardContent>
    </Card>
  );
};

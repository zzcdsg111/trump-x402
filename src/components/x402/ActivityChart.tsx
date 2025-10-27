/**
 * X402 Activity Chart Component
 */

import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { CalendarDays } from 'lucide-react';
import { X402Stats } from '../../types/x402';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
  stats: X402Stats;
}

export function ActivityChart({ stats }: ActivityChartProps) {
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  const [activeTab, setActiveTab] = useState<'total_transactions' | 'total_amount' | 'unique_buyers'>('total_transactions');

  const chartConfig = {
    total_transactions: {
      label: 'Transactions',
      value: `${(stats.transactions / 1000).toFixed(2)}K`,
      dataKey: 'transactions',
      color: '#3b82f6',
    },
    total_amount: {
      label: 'Volume',
      value: `$${(stats.volume / 1000).toFixed(2)}K`,
      dataKey: 'volume',
      color: '#10b981',
    },
    unique_buyers: {
      label: 'Buyers',
      value: `${(stats.buyers / 1000).toFixed(2)}K`,
      dataKey: 'buyers',
      color: '#8b5cf6',
    },
  };

  const currentConfig = chartConfig[activeTab];

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Activity</h3>
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="rounded-r-none border-r-0">
            <CalendarDays className="size-4 text-foreground/50" />
          </Button>
          <Select value={period} onValueChange={(v) => setPeriod(v as '7d' | '30d')}>
            <SelectTrigger className="w-fit rounded-l-none border-l-0 text-xs md:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Past 7 Days</SelectItem>
              <SelectItem value="30d">Past 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
          <TabsList className="w-full bg-muted border-b rounded-none h-auto p-0 justify-start overflow-x-auto">
            {Object.entries(chartConfig).map(([key, config]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex flex-col gap-2 p-3 md:p-4 min-w-28 md:min-w-56 border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-card rounded-none border-r"
              >
                <div className="flex flex-col gap-1 text-left">
                  <p className="text-sm font-semibold text-muted-foreground">{config.label}</p>
                  <p className="text-xl md:text-3xl font-bold text-muted-foreground group-data-[state=active]:text-foreground">
                    {config.value}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(chartConfig).map(([key, config]) => (
            <TabsContent key={key} value={key} className="p-4 md:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={config.dataKey}
                    stroke={config.color}
                    strokeWidth={2}
                    fill={`url(#gradient-${key})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}

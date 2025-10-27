/**
 * X402 Server Overview Component
 */

import { X402Server } from '../../types/x402';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Server, TestTube, Plus, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

interface ServerOverviewProps {
  server: X402Server;
  onTryResources?: () => void;
  onRegisterResource?: () => void;
}

export function ServerOverview({ server, onTryResources, onRegisterResource }: ServerOverviewProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const stats = [
    { label: 'Resources', value: server.resourceCount, icon: Server },
    { label: 'Transactions', value: `${(server.totalTransactions / 1000).toFixed(2)}K`, icon: TrendingUp },
    { label: 'Volume', value: `$${(server.totalVolume / 1000).toFixed(2)}K`, icon: DollarSign },
    { label: 'Latest', value: formatTimeAgo(server.latestActivity), icon: Calendar },
  ];

  return (
    <Card className="relative mt-10 md:mt-12 border shadow-sm">
      {/* Server Icon */}
      <div className="absolute top-0 left-4 -translate-y-12 size-12 md:size-16 flex items-center justify-center border rounded-md overflow-hidden bg-card shadow-sm">
        <Server className="size-8 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7">
        {/* Left Section - Server Info */}
        <div className="flex flex-col gap-4 p-4 pt-8 md:pt-10 col-span-5">
          <div>
            <h1 className="text-3xl font-bold break-words line-clamp-2">{server.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <code className="text-sm text-muted-foreground font-mono">
                {formatAddress(server.address)}
              </code>
              <Badge variant="outline" className="text-xs">Server</Badge>
            </div>
            <p className="text-muted-foreground mt-2">{server.description}</p>
          </div>

          <div className="flex flex-row gap-2">
            {onTryResources && (
              <Button 
                onClick={onTryResources}
                className="bg-gradient-to-br from-primary via-primary/80 to-primary text-white hover:opacity-90 shadow-md"
              >
                <TestTube className="size-4 mr-2" />
                Try Resources
              </Button>
            )}
            {onRegisterResource && (
              <Button variant="outline" onClick={onRegisterResource}>
                <Plus className="size-4 mr-2" />
                Register Resource
              </Button>
            )}
          </div>
        </div>

        {/* Right Section - Stats Grid */}
        <div className="col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-1 h-full rounded-b-lg md:rounded-bl-none md:rounded-r-lg border-t md:border-l md:border-t-0">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex justify-between flex-1 px-4 gap-2 py-3 ${
                    index % 2 === 0 ? 'border-r md:border-r-0' : ''
                  } ${index < 2 ? 'border-b' : ''} md:border-b md:last:border-b-0`}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="size-4 shrink-0" />
                    <span className="text-xs font-medium tracking-wider">{stat.label}</span>
                  </div>
                  <div className="text-lg font-bold font-mono">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

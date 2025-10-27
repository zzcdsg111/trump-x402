/**
 * X402 Protocol Types - Trump Token
 */

export interface X402Server {
  id: string;
  name: string;
  address: string;
  description: string;
  resourceCount: number;
  totalTransactions: number;
  totalVolume: number;
  uniqueBuyers: number;
  latestActivity: Date;
}

export interface X402Resource {
  id: string;
  serverId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  accessCount: number;
  revenue: number;
  createdAt: Date;
  status: 'active' | 'inactive';
}

export interface X402Transaction {
  id: string;
  txHash: string;
  resourceId: string;
  resourceName: string;
  buyer: string;
  amount: number;
  currency: string;
  chain: string;
  chainLogo: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
}

export interface X402Stats {
  period: '7d' | '30d' | '90d' | 'all';
  transactions: number;
  volume: number;
  buyers: number;
  chartData: {
    date: string;
    transactions: number;
    volume: number;
    buyers: number;
  }[];
}

export type ChainType = 'ethereum' | 'base' | 'polygon' | 'arbitrum' | 'optimism';

export interface ChainInfo {
  name: string;
  logo: string;
  color: string;
}

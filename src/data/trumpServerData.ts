/**
 * Trump Token Server Mock Data
 */

import { X402Server, X402Resource, X402Transaction, X402Stats, ChainInfo } from '../types/x402';

export const trumpServer: X402Server = {
  id: 'trump-token-server',
  name: 'Trump Token',
  address: '0x8d8fa42584a727488eeb0e29405ad794a105bb9b',
  description: 'Official Trump Token 402 Protocol Server',
  resourceCount: 3,
  totalTransactions: 77280,
  totalVolume: 3000,
  uniqueBuyers: 3380,
  latestActivity: new Date(Date.now() - 60000), // 1 minute ago
};

export const trumpResources: X402Resource[] = [
  {
    id: 'trump-premium-news',
    serverId: 'trump-token-server',
    name: 'Trump Premium News Feed',
    description: 'Exclusive Trump political news and analysis',
    price: 0.01,
    currency: 'TRUMP',
    accessCount: 45230,
    revenue: 452.3,
    createdAt: new Date('2024-01-15'),
    status: 'active',
  },
  {
    id: 'trump-trading-signals',
    serverId: 'trump-token-server',
    name: 'Trump Trading Signals',
    description: 'Real-time Trump token trading signals and market analysis',
    price: 0.05,
    currency: 'TRUMP',
    accessCount: 23450,
    revenue: 1172.5,
    createdAt: new Date('2024-01-20'),
    status: 'active',
  },
  {
    id: 'trump-exclusive-content',
    serverId: 'trump-token-server',
    name: 'Trump Exclusive Content',
    description: 'Behind-the-scenes content and exclusive interviews',
    price: 0.1,
    currency: 'TRUMP',
    accessCount: 8600,
    revenue: 860,
    createdAt: new Date('2024-02-01'),
    status: 'active',
  },
];

export const generateMockTransactions = (count: number = 10): X402Transaction[] => {
  const chains = ['ethereum', 'base', 'polygon', 'arbitrum', 'optimism'];
  const resources = trumpResources;
  
  return Array.from({ length: count }, (_, i) => {
    const resource = resources[Math.floor(Math.random() * resources.length)];
    const chain = chains[Math.floor(Math.random() * chains.length)];
    
    return {
      id: `tx-${Date.now()}-${i}`,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      resourceId: resource.id,
      resourceName: resource.name,
      buyer: `0x${Math.random().toString(16).substr(2, 40)}`,
      amount: resource.price,
      currency: resource.currency,
      chain,
      chainLogo: `/chains/${chain}.png`,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.05 ? 'success' : 'pending',
    };
  });
};

export const trumpStats: X402Stats = {
  period: '7d',
  transactions: 77280,
  volume: 3000,
  buyers: 3380,
  chartData: [
    { date: '2024-10-20', transactions: 8500, volume: 340, buyers: 420 },
    { date: '2024-10-21', transactions: 9200, volume: 380, buyers: 450 },
    { date: '2024-10-22', transactions: 11500, volume: 460, buyers: 520 },
    { date: '2024-10-23', transactions: 13200, volume: 520, buyers: 580 },
    { date: '2024-10-24', transactions: 10800, volume: 430, buyers: 490 },
    { date: '2024-10-25', transactions: 12100, volume: 480, buyers: 510 },
    { date: '2024-10-26', transactions: 11980, volume: 390, buyers: 410 },
  ],
};

export const chainInfo: Record<string, ChainInfo> = {
  ethereum: {
    name: 'Ethereum',
    logo: '⟠',
    color: '#627EEA',
  },
  base: {
    name: 'Base',
    logo: '🔵',
    color: '#0052FF',
  },
  polygon: {
    name: 'Polygon',
    logo: '⬡',
    color: '#8247E5',
  },
  arbitrum: {
    name: 'Arbitrum',
    logo: '◆',
    color: '#28A0F0',
  },
  optimism: {
    name: 'Optimism',
    logo: '🔴',
    color: '#FF0420',
  },
};

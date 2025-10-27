/**
 * 数据转换工具 - 将Supabase数据转换为X402类型
 */

import type { Transaction, Resource } from '../lib/supabase';
import type { X402Transaction, X402Resource } from '../types/x402';

const chainLogos: Record<string, string> = {
  ethereum: '⟠',
  base: '🔵',
  polygon: '🟣',
  arbitrum: '🔷',
  optimism: '🔴',
};

// 转换交易数据
export function transformTransaction(tx: Transaction): X402Transaction {
  return {
    id: tx.id,
    txHash: tx.tx_hash,
    resourceId: tx.resource_id || '',
    resourceName: 'Resource', // 可以通过join获取实际名称
    buyer: tx.from_address,
    amount: Number(tx.amount),
    currency: tx.token,
    chain: tx.chain,
    chainLogo: chainLogos[tx.chain] || '⛓️',
    timestamp: new Date(tx.timestamp),
    status: tx.status === 'confirmed' ? 'success' : tx.status === 'pending' ? 'pending' : 'failed',
  };
}

// 转换资源数据
export function transformResource(resource: Resource): X402Resource {
  return {
    id: resource.id,
    serverId: '0x8d8fa42584a727488eeb0e29405ad794a105bb9b',
    name: resource.name,
    description: resource.description || '',
    price: Number(resource.price),
    currency: resource.currency,
    accessCount: resource.access_count,
    revenue: resource.access_count * Number(resource.price),
    createdAt: new Date(resource.created_at),
    status: resource.access_count > 0 ? 'active' : 'inactive',
  };
}

// 批量转换交易
export function transformTransactions(transactions: Transaction[]): X402Transaction[] {
  return transactions.map(transformTransaction);
}

// 批量转换资源
export function transformResources(resources: Resource[]): X402Resource[] {
  return resources.map(transformResource);
}

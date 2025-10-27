/**
 * Supabase数据获取Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabasePaymentProvider } from '../services/supabasePaymentProvider';
import type { Transaction, Resource, PaymentRecord } from '../lib/supabase';

// 获取交易记录
export function useTransactions(limit: number = 50) {
  return useQuery({
    queryKey: ['transactions', limit],
    queryFn: () => supabasePaymentProvider.getTransactions(limit),
    refetchInterval: 10000, // 每10秒自动刷新
  });
}

// 获取资源列表
export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => supabasePaymentProvider.getResources(),
  });
}

// 获取用户支付记录
export function useUserPayments(userAddress: string) {
  return useQuery({
    queryKey: ['userPayments', userAddress],
    queryFn: () => supabasePaymentProvider.getUserPayments(userAddress),
    enabled: !!userAddress,
  });
}

// 验证支付
export function useVerifyPayment() {
  return useMutation({
    mutationFn: (paymentId: string) => supabasePaymentProvider.verifyPayment(paymentId),
  });
}

// 计算统计数据
export function useStats() {
  const { data: transactions = [] } = useTransactions();
  const { data: resources = [] } = useResources();

  // 生成图表数据（最近7天）
  const chartData: {
    date: string;
    transactions: number;
    volume: number;
    buyers: number;
  }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.timestamp).toISOString().split('T')[0];
      return txDate === dateStr;
    });
    
    chartData.push({
      date: dateStr,
      transactions: dayTransactions.length,
      volume: dayTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0),
      buyers: new Set(dayTransactions.map(tx => tx.from_address)).size,
    });
  }

  const stats = {
    period: '7d' as const,
    transactions: transactions.length,
    volume: transactions.reduce((sum, tx) => sum + Number(tx.amount), 0),
    buyers: new Set(transactions.map(tx => tx.from_address)).size,
    chartData,
  };

  return { data: stats, isLoading: false };
}

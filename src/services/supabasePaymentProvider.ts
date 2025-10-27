/**
 * Supabase支付提供商 - 真实数据库集成
 */

import { supabase } from '../lib/supabase';
import type { Transaction, Resource, PaymentRecord } from '../lib/supabase';
import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  PaymentToken,
  PaymentProviderConfig,
} from '../types/payment';
import { IPaymentProvider } from './paymentProvider';

export class SupabasePaymentProvider implements IPaymentProvider {
  private config?: PaymentProviderConfig;

  initialize(config: PaymentProviderConfig): void {
    this.config = config;
    console.log('Supabase payment provider initialized:', config.environment);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // 1. 获取资源信息
      const { data: resource, error: resourceError } = await supabase
        .from('resources')
        .select('*')
        .eq('id', request.resourceId)
        .single();

      if (resourceError || !resource) {
        return {
          success: false,
          paymentId: '',
          status: PaymentStatus.FAILED,
          message: '资源不存在',
        };
      }

      // 2. 验证支付金额
      if (request.amount < resource.price) {
        return {
          success: false,
          paymentId: '',
          status: PaymentStatus.FAILED,
          message: '支付金额不足',
        };
      }

      // 3. 创建交易记录
      const transaction: Partial<Transaction> = {
        tx_hash: `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`,
        from_address: request.userId || 'anonymous',
        to_address: '0x8d8fa42584a727488eeb0e29405ad794a105bb9b', // Trump服务器地址
        amount: request.amount,
        token: 'TRUMP',
        chain: 'ethereum',
        status: 'pending',
        resource_id: request.resourceId,
      };

      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      if (txError || !txData) {
        return {
          success: false,
          paymentId: '',
          status: PaymentStatus.FAILED,
          message: '交易创建失败',
        };
      }

      // 4. 创建支付记录
      const paymentRecord: Partial<PaymentRecord> = {
        user_address: request.userId || 'anonymous',
        resource_id: request.resourceId,
        transaction_id: txData.id,
        amount: request.amount,
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天有效期
      };

      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_records')
        .insert(paymentRecord)
        .select()
        .single();

      if (paymentError || !paymentData) {
        return {
          success: false,
          paymentId: txData.id,
          status: PaymentStatus.FAILED,
          message: '支付记录创建失败',
        };
      }

      // 5. 模拟区块链确认（实际应用中应监听链上事件）
      setTimeout(async () => {
        await supabase
          .from('transactions')
          .update({ status: 'confirmed' })
          .eq('id', txData.id);

        await supabase
          .from('payment_records')
          .update({ status: 'completed' })
          .eq('id', paymentData.id);

        // 更新资源访问计数
        await supabase
          .from('resources')
          .update({ access_count: (resource.access_count || 0) + 1 })
          .eq('id', request.resourceId);
      }, 3000);

      // 6. 生成访问令牌
      const token = this.generateToken(request.resourceId, request.userId);

      return {
        success: true,
        paymentId: txData.id,
        status: PaymentStatus.PENDING,
        message: '支付处理中，请等待区块链确认',
        token,
        transactionHash: txData.tx_hash,
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        paymentId: '',
        status: PaymentStatus.FAILED,
        message: '支付处理失败',
      };
    }
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('payment_records')
        .select('status, expires_at')
        .eq('id', paymentId)
        .single();

      if (error || !data) {
        return false;
      }

      // 检查支付状态和有效期
      const isValid = data.status === 'completed' && new Date(data.expires_at) > new Date();
      return isValid;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  generateToken(resourceId: string, userId?: string): PaymentToken {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30天有效期

    return {
      token: `tk_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`,
      resourceId,
      userId,
      expiresAt,
      issuedAt: new Date(),
    };
  }

  // 获取所有交易记录
  async getTransactions(limit: number = 50): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data || [];
  }

  // 获取所有资源
  async getResources(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      return [];
    }

    return data || [];
  }

  // 获取用户的支付记录
  async getUserPayments(userAddress: string): Promise<PaymentRecord[]> {
    const { data, error } = await supabase
      .from('payment_records')
      .select('*')
      .eq('user_address', userAddress)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user payments:', error);
      return [];
    }

    return data || [];
  }
}

// 导出单例实例
export const supabasePaymentProvider = new SupabasePaymentProvider();
supabasePaymentProvider.initialize({
  apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  environment: import.meta.env.MODE as 'development' | 'production',
});

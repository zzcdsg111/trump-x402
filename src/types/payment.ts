/**
 * HTTP 402 Payment Required Protocol Framework
 * 核心类型定义
 */

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  CRYPTO = 'crypto',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
}

export interface PaymentToken {
  token: string;
  expiresAt: Date;
  userId?: string;
  resourceId: string;
  issuedAt?: Date;
}

export interface PaymentRequest {
  resourceId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  token?: PaymentToken;
  redirectUrl?: string;
  message?: string;
  transactionHash?: string;
}

export interface ProtectedResource {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  requiresPayment: boolean;
  content?: string;
}

export interface PaymentVerification {
  isValid: boolean;
  token?: PaymentToken;
  error?: string;
}

export interface PaymentProviderConfig {
  apiKey: string;
  secretKey?: string;
  webhookUrl?: string;
  environment: 'sandbox' | 'production' | 'development';
}

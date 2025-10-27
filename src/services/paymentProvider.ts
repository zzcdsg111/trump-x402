/**
 * 支付提供商接口和模拟实现
 */

import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  PaymentToken,
  PaymentProviderConfig,
} from '../types/payment';

export interface IPaymentProvider {
  initialize(config: PaymentProviderConfig): void;
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(paymentId: string): Promise<boolean>;
  generateToken(resourceId: string, userId?: string): PaymentToken;
}

/**
 * 模拟支付提供商实现
 */
export class MockPaymentProvider implements IPaymentProvider {
  private config?: PaymentProviderConfig;
  private payments: Map<string, PaymentResponse> = new Map();

  initialize(config: PaymentProviderConfig): void {
    this.config = config;
    console.log('Payment provider initialized:', config.environment);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 模拟90%成功率
    const success = Math.random() > 0.1;
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response: PaymentResponse = {
      success,
      paymentId,
      status: success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
      message: success ? 'Payment processed successfully' : 'Payment failed',
    };

    if (success) {
      response.token = this.generateToken(request.resourceId);
    }

    this.payments.set(paymentId, response);
    return response;
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    const payment = this.payments.get(paymentId);
    return payment?.status === PaymentStatus.COMPLETED || false;
  }

  generateToken(resourceId: string, userId?: string): PaymentToken {
    const token = btoa(
      JSON.stringify({
        resourceId,
        userId,
        timestamp: Date.now(),
        random: Math.random().toString(36).substr(2, 9),
      })
    );

    return {
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时
      userId,
      resourceId,
    };
  }
}

/**
 * 支付提供商工厂
 */
export class PaymentProviderFactory {
  private static instance: IPaymentProvider;

  static getProvider(): IPaymentProvider {
    if (!this.instance) {
      this.instance = new MockPaymentProvider();
      this.instance.initialize({
        apiKey: 'mock_api_key',
        environment: 'sandbox',
      });
    }
    return this.instance;
  }
}

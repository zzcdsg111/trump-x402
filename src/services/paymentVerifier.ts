/**
 * 支付验证服务
 */

import { PaymentToken, PaymentVerification } from '../types/payment';

export class PaymentVerifier {
  private static tokenStore: Map<string, PaymentToken> = new Map();

  /**
   * 存储支付令牌
   */
  static storeToken(token: PaymentToken): void {
    this.tokenStore.set(token.token, token);
    
    // 设置过期自动清理
    const expiresIn = token.expiresAt.getTime() - Date.now();
    if (expiresIn > 0) {
      setTimeout(() => {
        this.tokenStore.delete(token.token);
      }, expiresIn);
    }
  }

  /**
   * 验证支付令牌
   */
  static verifyToken(token: string, resourceId: string): PaymentVerification {
    const storedToken = this.tokenStore.get(token);

    if (!storedToken) {
      return {
        isValid: false,
        error: 'Token not found',
      };
    }

    if (storedToken.resourceId !== resourceId) {
      return {
        isValid: false,
        error: 'Token does not match resource',
      };
    }

    if (storedToken.expiresAt < new Date()) {
      this.tokenStore.delete(token);
      return {
        isValid: false,
        error: 'Token has expired',
      };
    }

    return {
      isValid: true,
      token: storedToken,
    };
  }

  /**
   * 从本地存储获取令牌
   */
  static getStoredToken(resourceId: string): string | null {
    const key = `payment_token_${resourceId}`;
    return localStorage.getItem(key);
  }

  /**
   * 保存令牌到本地存储
   */
  static saveTokenToStorage(resourceId: string, token: string): void {
    const key = `payment_token_${resourceId}`;
    localStorage.setItem(key, token);
  }

  /**
   * 清除本地存储的令牌
   */
  static clearStoredToken(resourceId: string): void {
    const key = `payment_token_${resourceId}`;
    localStorage.removeItem(key);
  }
}

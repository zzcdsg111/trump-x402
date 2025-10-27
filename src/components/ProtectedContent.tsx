/**
 * 受保护内容组件 - 实现402协议访问控制
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Lock, CheckCircle } from 'lucide-react';
import { PaymentGateway } from './PaymentGateway';
import { PaymentVerifier } from '../services/paymentVerifier';
import { supabasePaymentProvider } from '../services/supabasePaymentProvider';
import { ProtectedResource, PaymentResponse } from '../types/payment';

interface ProtectedContentProps {
  resource: ProtectedResource;
}

export function ProtectedContent({ resource }: ProtectedContentProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    // 检查是否已有有效的支付令牌
    const storedToken = PaymentVerifier.getStoredToken(resource.id);
    if (storedToken) {
      const verification = PaymentVerifier.verifyToken(storedToken, resource.id);
      if (verification.isValid) {
        setHasAccess(true);
      } else {
        PaymentVerifier.clearStoredToken(resource.id);
      }
    }
  }, [resource.id]);

  const handlePaymentSuccess = (response: PaymentResponse) => {
    if (response.token) {
      // 存储令牌
      PaymentVerifier.storeToken(response.token);
      PaymentVerifier.saveTokenToStorage(resource.id, response.token.token);
      setHasAccess(true);
      setShowPayment(false);
    }
  };

  if (!resource.requiresPayment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{resource.name}</CardTitle>
          <CardDescription>{resource.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {resource.content || 'Content not available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showPayment) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <PaymentGateway
          resourceId={resource.id}
          amount={resource.price}
          currency={resource.currency}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {resource.name}
          </CardTitle>
          <CardDescription>{resource.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>HTTP 402 - Payment Required</AlertTitle>
            <AlertDescription>
              This content requires payment to access. Price: {resource.currency} {resource.price.toFixed(2)}
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <button
              onClick={() => setShowPayment(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Purchase Access
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          {resource.name}
        </CardTitle>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700 dark:text-green-300">Access Granted</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            You have successfully purchased access to this content.
          </AlertDescription>
        </Alert>
        <div className="prose max-w-none">
          {resource.content || 'Premium content is now available to you.'}
        </div>
      </CardContent>
    </Card>
  );
}

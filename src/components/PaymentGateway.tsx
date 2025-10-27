/**
 * 支付网关组件
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CreditCard, Wallet, DollarSign } from 'lucide-react';
import { PaymentMethod, PaymentRequest, PaymentResponse } from '../types/payment';
import { supabasePaymentProvider } from '../services/supabasePaymentProvider';

interface PaymentGatewayProps {
  resourceId: string;
  amount: number;
  currency?: string;
  onSuccess: (response: PaymentResponse) => void;
  onCancel?: () => void;
}

export function PaymentGateway({
  resourceId,
  amount,
  currency = 'USD',
  onSuccess,
  onCancel,
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const provider = supabasePaymentProvider;
      const request: PaymentRequest = {
        resourceId,
        amount,
        currency,
        method: selectedMethod,
      };

      const response = await provider.processPayment(request);

      if (response.success) {
        onSuccess(response);
      } else {
        setError(response.message || 'Payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { value: PaymentMethod.CREDIT_CARD, label: 'Credit Card', icon: CreditCard },
    { value: PaymentMethod.CRYPTO, label: 'Cryptocurrency', icon: Wallet },
    { value: PaymentMethod.STRIPE, label: 'Stripe', icon: DollarSign },
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment Required</CardTitle>
        <CardDescription>
          Complete payment to access this resource
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">Amount Due</span>
          <span className="text-2xl font-bold">
            {currency} {amount.toFixed(2)}
          </span>
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={method.value} id={method.value} />
                  <Label htmlFor={method.value} className="flex items-center gap-2 cursor-pointer flex-1">
                    <Icon className="h-4 w-4" />
                    {method.label}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isProcessing} className="flex-1">
            Cancel
          </Button>
        )}
        <Button onClick={handlePayment} disabled={isProcessing} className="flex-1">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${currency} ${amount.toFixed(2)}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

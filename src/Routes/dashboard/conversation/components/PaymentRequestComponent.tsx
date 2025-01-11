import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button/button';

interface PaymentDetails {
  total: {
    label: string;
    amount: {
      currency: string;
      value: string;
    };
  };
}

const PaymentRequestComponent: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePayment = async () => {
    // Check if Payment Request API is supported
    if (!window.PaymentRequest) {
      setPaymentStatus('error');
      setErrorMessage('Payment Request API is not supported in this browser');
      return;
    }

    const paymentMethods = [
      {
        supportedMethods: 'basic-card',
        data: {
          supportedNetworks: ['visa', 'mastercard'],
          supportedTypes: ['credit', 'debit']
        }
      }
    ];

    const paymentDetails: PaymentDetails = {
      total: {
        label: 'Total',
        amount: {
          currency: 'USD',
          value: '19.99'
        }
      }
    };

    try {
      setPaymentStatus('processing');
      const paymentRequest = new PaymentRequest(paymentMethods, paymentDetails);

      // Check if payment can be made
      const canMakePayment = await paymentRequest.canMakePayment();
      if (!canMakePayment) {
        throw new Error('Payment method not available');
      }

      // Show payment UI
      const paymentResponse = await paymentRequest.show();
      
      // Process the payment
      // Here you would typically make an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated processing
      
      await paymentResponse.complete('success');
      setPaymentStatus('success');
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Payment</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Total Amount:</span>
            <span className="font-bold">$19.99</span>
          </div>

          {paymentStatus === 'error' && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'success' && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Payment completed successfully!</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handlePayment}
          disabled={paymentStatus === 'processing'}
        >
          {paymentStatus === 'processing' ? 'Processing...' : 'Pay Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentRequestComponent;
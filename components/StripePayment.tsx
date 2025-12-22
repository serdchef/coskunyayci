'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripePaymentProps {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

/**
 * Payment form component (inner - requires Elements provider)
 */
function PaymentFormInner({
  orderId,
  amount,
  customerEmail,
  customerName,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  // 1. Payment intent oluştur
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount,
            customerEmail,
            customerName,
            description: `Sipariş #${orderId}`,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || 'Failed to create payment intent');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    createPaymentIntent();
  }, [orderId, amount, customerEmail, customerName]);

  // 2. Ödeme işlemi gerçekleştir
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Stripe'a ödeme bilgilerini gönder
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerName,
              email: customerEmail,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onError?.(stripeError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        console.log('✅ Payment successful:', paymentIntent.id);
        onSuccess?.(paymentIntent.id);
        // Success sayfasına yönlendir
        router.push(`/checkout/success/${orderId}`);
      } else {
        setError('Payment could not be completed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Card Element */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gold-500/30">
        <label className="block text-sm font-semibold text-white mb-4">
          💳 Kart Bilgileri
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#fa755a',
              },
            },
            hidePostalCode: true,
          }}
          className="bg-white/5 rounded-lg p-4"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !stripe || !clientSecret}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
          loading || !stripe || !clientSecret
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-gold-600 to-gold-500 hover:shadow-lg hover:shadow-gold-500/50'
        }`}
      >
        {loading ? '⏳ Ödeme işleniyor...' : `💰 ${amount} TL Öde`}
      </button>

      {/* Info message */}
      <p className="text-center text-sm text-gray-300">
        🔒 Tüm ödemeler 256-bit SSL ile şifrelenir
      </p>
    </form>
  );
}

/**
 * Stripe Payment Component (outer - provides Elements)
 */
export default function StripePayment(props: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}

'use client';

import { useState } from 'react';

interface Plan {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    features: string | null;
}

interface PaymentButtonProps {
    plan: Plan;
    userId: string;
}

export function PaymentButton({ plan, userId }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/payment/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: plan.id,
                    userId: userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create payment request');
            }

            const data = await response.json();

            if (data.url) {
                // Redirect to ZarinPal payment gateway
                window.location.href = data.url;
            } else {
                throw new Error('Payment URL not received');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? 'در حال انتقال به درگاه پرداخت...' : `خرید اشتراک - ${plan.price.toLocaleString('fa-IR')} تومان`}
            </button>
            {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
            )}
        </div>
    );
}

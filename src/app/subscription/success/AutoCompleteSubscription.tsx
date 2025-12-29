'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  orderId: string;
}

export default function AutoCompleteSubscription({ orderId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'activating' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Memproses pembayaran...');

  useEffect(() => {
    const autoComplete = async () => {
      try {
        console.log('🔄 Auto-completing subscription for order:', orderId);
        setStatus('activating');
        setMessage('Mengaktifkan langganan...');

        // Call auto-complete API (will only work in sandbox)
        const response = await fetch('/api/subscription/auto-complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log('✅ Subscription auto-completed:', result);
          setStatus('success');
          setMessage('Langganan berhasil diaktifkan!');
          
          // Refresh page to update UI
          setTimeout(() => {
            router.refresh();
          }, 1000);
        } else {
          console.error('Auto-complete failed:', result);
          setStatus('error');
          setMessage('Pembayaran dalam proses verifikasi...');
        }
      } catch (error) {
        console.error('Auto-complete error:', error);
        setStatus('error');
        setMessage('Pembayaran dalam proses verifikasi...');
      }
    };

    // Auto-complete after 2 seconds
    const timer = setTimeout(autoComplete, 2000);
    return () => clearTimeout(timer);
  }, [orderId, router]);

  // Don't show anything to user, process in background
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center gap-3">
        {status === 'checking' || status === 'activating' ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
        ) : status === 'success' ? (
          <div className="text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="text-yellow-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}

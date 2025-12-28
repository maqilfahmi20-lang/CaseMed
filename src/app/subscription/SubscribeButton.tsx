'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubscribeButtonProps {
  userId: string;
}

export default function SubscribeButton({ userId }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat pembayaran');
      }

      // Redirect to Midtrans payment page using snap_token
      if (data.snap_token && (window as any).snap) {
        (window as any).snap.pay(data.snap_token, {
          onSuccess: function () {
            router.push('/subscription/success');
          },
          onPending: function () {
            router.push('/subscription/pending');
          },
          onError: function () {
            alert('Pembayaran gagal. Silakan coba lagi.');
            router.refresh();
          },
          onClose: function () {
            console.log('Payment popup closed');
            router.refresh();
          }
        });
      } else {
        throw new Error('Snap token tidak tersedia');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load Midtrans Snap Script */}
      <script
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js'}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        async
      />
      
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Memproses...
          </span>
        ) : (
          '🚀 Berlangganan Sekarang'
        )}
      </button>
    </>
  );
}

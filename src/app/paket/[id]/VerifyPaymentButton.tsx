'use client';

import { verifyPayment } from '@/app/actions/payment-verify';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface VerifyPaymentButtonProps {
  orderId: string;
}

export default function VerifyPaymentButton({ orderId }: VerifyPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await verifyPayment(orderId);
      
      if (result.error) {
        setMessage(`Error: ${result.error}`);
        return;
      }

      if (result.status === 'paid') {
        setMessage('✅ Pembayaran berhasil diverifikasi!');
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else if (result.status === 'pending') {
        setMessage('⏳ Pembayaran masih pending...');
      } else {
        setMessage('❌ Pembayaran gagal atau dibatalkan');
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-blue-800 mb-3">
        💳 Sudah menyelesaikan pembayaran? Klik tombol di bawah untuk memverifikasi.
      </p>
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition"
      >
        {loading ? 'Memverifikasi...' : 'Verifikasi Pembayaran'}
      </button>
      {message && (
        <p className="mt-3 text-sm text-center font-medium">
          {message}
        </p>
      )}
    </div>
  );
}

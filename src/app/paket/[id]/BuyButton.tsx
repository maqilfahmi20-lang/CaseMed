'use client';

import { createPayment } from '@/app/actions/payment';
import { useState } from 'react';

interface BuyButtonProps {
  packageId: string;
  price: number;
  hasPaid: boolean;
}

export default function BuyButton({ packageId, price, hasPaid }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const result = await createPayment(packageId);
      
      if (result.error) {
        alert(result.error);
        return;
      }

      if (result.redirectUrl) {
        // Redirect to Midtrans payment page
        window.location.href = result.redirectUrl;
      }
    } catch (error: any) {
      alert(error.message || 'Gagal memproses pembayaran');
    } finally {
      setLoading(false);
    }
  };

  if (hasPaid) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-800 font-medium">Sudah Dibeli</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memproses...
        </span>
      ) : (
        `Beli Paket - Rp ${price.toLocaleString('id-ID')}`
      )}
    </button>
  );
}

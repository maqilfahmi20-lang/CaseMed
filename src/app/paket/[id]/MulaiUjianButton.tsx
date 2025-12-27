'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { startAttempt } from '@/app/actions/ujian';

export default function MulaiUjianButton({ packageId }: { packageId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await startAttempt(packageId);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Redirect to ujian page
      router.push(`/ujian/${result.attemptId}`);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <button
        onClick={handleStart}
        disabled={isLoading}
        className="flex-1 bg-blue-600 text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Memulai...' : '🚀 Mulai Ujian'}
      </button>
    </>
  );
}

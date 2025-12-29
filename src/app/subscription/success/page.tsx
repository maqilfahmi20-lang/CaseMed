import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AutoCompleteSubscription from './AutoCompleteSubscription';

export default async function SubscriptionSuccessPage({
  searchParams,
}: {
  searchParams: { order_id?: string };
}) {
  const user = await requireAuth();
  
  // Get latest pending subscription payment for this user
  let orderId = searchParams.order_id;
  
  if (!orderId) {
    const latestPayment = await prisma.payment.findFirst({
      where: {
        user_id: user.id,
        paymentType: 'subscription',
        status: 'pending',
      },
      orderBy: { createdAt: 'desc' }
    });
    
    orderId = latestPayment?.order_id;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      {/* Auto-complete component will trigger webhook in background */}
      {orderId && <AutoCompleteSubscription orderId={orderId} />}
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-block bg-green-100 p-4 rounded-full">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🎉 Pembayaran Berhasil!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Selamat! Langganan premium Anda telah aktif. Anda sekarang memiliki akses ke semua paket simulasi dan latihan UKMPPD.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all"
          >
            Mulai Belajar →
          </Link>
          
          <Link
            href="/subscription"
            className="block w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Lihat Detail Langganan
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AutoCompleteSubscription from '../success/AutoCompleteSubscription';

export default async function SubscriptionPendingPage({
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      {/* Auto-complete component will trigger webhook in background */}
      {orderId && <AutoCompleteSubscription orderId={orderId} />}
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-block bg-yellow-100 p-4 rounded-full">
            <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ⏳ Pembayaran Diproses
        </h1>
        
        <p className="text-gray-600 mb-8">
          Pembayaran Anda sedang dalam proses verifikasi. Kami akan mengaktifkan langganan premium Anda segera setelah pembayaran dikonfirmasi.
        </p>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-700">
            <strong>Catatan:</strong> Proses verifikasi biasanya memakan waktu beberapa menit. Refresh halaman ini atau cek email Anda untuk update status pembayaran.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-700 hover:to-yellow-800 transition-all"
          >
            Kembali ke Dashboard
          </Link>
          
          <Link
            href="/subscription"
            className="block w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Cek Status Langganan
          </Link>
        </div>
      </div>
    </div>
  );
}

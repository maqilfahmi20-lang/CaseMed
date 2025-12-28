import { requireAuth } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { verifyPayment } from '@/app/actions/payment-verify';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MulaiUjianButton from './MulaiUjianButton';
import BuyButton from './BuyButton';
import VerifyPaymentButton from './VerifyPaymentButton';

export default async function PaketDetailPage({ 
  params,
  searchParams 
}: { 
  params: { id: string };
  searchParams: { order_id?: string; payment?: string };
}) {
  const user = await requireAuth();
  
  // Verify payment if returning from Midtrans
  if (searchParams.order_id && searchParams.payment === 'success') {
    await verifyPayment(searchParams.order_id);
  }
  
  // Fetch current user with subscription info
  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      subscriptionStatus: true,
      subscriptionEnd: true,
    }
  });

  // Check if subscription is active
  const isSubscriptionActive = currentUser?.subscriptionStatus === 'active' 
    && currentUser?.subscriptionEnd 
    && new Date(currentUser.subscriptionEnd) > new Date();
  
  const paket = await prisma.package.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: { questions: true }
      }
    }
  });

  if (!paket) {
    notFound();
  }

  // Check user attempts
  const userAttempts = await prisma.userAttempt.count({
    where: { 
      user_id: user.id,
      package_id: paket.id
    }
  });

  // Fetch user attempt history for this package
  const attemptHistory = await prisma.userAttempt.findMany({
    where: {
      user_id: user.id,
      package_id: paket.id,
      selesai_at: { not: null }
    },
    orderBy: { selesai_at: 'desc' }
  });

  // Check payment status - free package OR has active subscription OR has paid for this specific package
  
  // Check if user has paid specifically for this package (individual purchase)
  const hasPackagePayment = await prisma.payment.findFirst({
    where: {
      user_id: user.id,
      package_id: paket.id,
      status: 'paid'
    }
  });
  
  // Debug logging
  console.log('=== Package Access Check ===');
  console.log('Package ID:', paket.id);
  console.log('User ID:', user.id);
  console.log('Is Free:', paket.is_free);
  console.log('Price:', paket.harga);
  console.log('Subscription Active:', isSubscriptionActive);
  console.log('Has Package Payment:', hasPackagePayment !== null);
  console.log('Package Payment:', hasPackagePayment);
  
  const hasPaid = paket.is_free || (paket.harga === 0) || isSubscriptionActive || hasPackagePayment !== null;
  
  console.log('Final hasPaid:', hasPaid);
  console.log('===========================');

  // Check for pending payment
  const pendingPayment = await prisma.payment.findFirst({
    where: {
      user_id: user.id,
      package_id: paket.id,
      status: 'pending'
    },
    orderBy: { createdAt: 'desc' }
  });

  const canAttempt = userAttempts < paket.max_attempt;

  const handleLogout = async () => {
    'use server';
    await logoutAction();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600 hover:opacity-80">
              CaseMed
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Halo, {user.nama}</span>
              <form action={handleLogout}>
                <button
                  type="submit"
                  className="text-gray-600 hover:text-gray-800 transition"
                >
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            ← Kembali ke Dashboard
          </Link>

          {/* Package Info */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                paket.tipe_paket === 'ukmppd' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {paket.tipe_paket.toUpperCase()}
              </span>
              <div className="text-3xl font-bold text-blue-600">
                {(paket.harga ?? 0) === 0 ? 'GRATIS' : `Rp ${(paket.harga ?? 0).toLocaleString('id-ID')}`}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">{paket.nama}</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📝</div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{paket._count.questions}</div>
                  <div className="text-sm text-gray-600">Soal</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔄</div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{paket.max_attempt}x</div>
                  <div className="text-sm text-gray-600">Max Percobaan</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">📊</div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{userAttempts}/{paket.max_attempt}</div>
                  <div className="text-sm text-gray-600">Sudah Dikerjakan</div>
                </div>
              </div>
            </div>

            {/* Status */}
            {!canAttempt ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold">
                  ⚠️ Anda sudah mencapai batas maksimal percobaan untuk paket ini.
                </p>
              </div>
            ) : !hasPaid && (paket.harga || 0) > 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-semibold">
                  💳 Paket berbayar. Silakan lakukan pembayaran terlebih dahulu.
                </p>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="space-y-4">
              {!hasPaid && (paket.harga || 0) > 0 && canAttempt ? (
                <>
                  {/* Premium package - redirect to subscription */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-3xl">💎</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-purple-900 mb-2">Paket Premium</h3>
                        <p className="text-sm text-purple-700 mb-3">
                          Paket ini termasuk dalam langganan premium. Dengan berlangganan Rp 55.000/bulan, 
                          Anda mendapat akses ke <strong>SEMUA paket simulasi dan latihan</strong> tanpa batas!
                        </p>
                        <ul className="text-sm text-purple-700 space-y-1 mb-4">
                          <li>✅ Akses semua paket premium</li>
                          <li>✅ Hemat hingga 90% dibanding beli satuan</li>
                          <li>✅ Update konten rutin setiap bulan</li>
                        </ul>
                      </div>
                    </div>
                    <Link
                      href="/subscription"
                      className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      🚀 Berlangganan Sekarang
                    </Link>
                  </div>
                </>
              ) : canAttempt && hasPaid ? (
                <>
                  {/* Show subscription status if active */}
                  {isSubscriptionActive && currentUser?.subscriptionEnd && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-800 font-medium">
                          ✨ Akses Premium Aktif - Berlaku hingga {new Date(currentUser.subscriptionEnd).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Show individual package purchase status */}
                  {!isSubscriptionActive && hasPackagePayment && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-blue-800 font-medium">
                          ✅ Paket Sudah Dibeli
                        </span>
                      </div>
                    </div>
                  )}
                  <MulaiUjianButton packageId={paket.id} />
                </>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 text-center py-4 rounded-lg font-bold text-lg cursor-not-allowed"
                >
                  Sudah Mencapai Batas
                </button>
              )}
            </div>
          </div>

          {/* User History */}
          {attemptHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Riwayat Percobaan ({attemptHistory.length}x)
              </h2>
              <div className="space-y-3">
                {attemptHistory.map((attempt, index) => {
                  const nilai = attempt.nilai || 0;
                  let nilaiColor = 'text-gray-600';
                  let nilaiGrade = '';
                  
                  if (nilai >= 80) {
                    nilaiColor = 'text-green-600';
                    nilaiGrade = 'Sangat Baik';
                  } else if (nilai >= 70) {
                    nilaiColor = 'text-blue-600';
                    nilaiGrade = 'Baik';
                  } else if (nilai >= 60) {
                    nilaiColor = 'text-yellow-600';
                    nilaiGrade = 'Cukup';
                  } else {
                    nilaiColor = 'text-red-600';
                    nilaiGrade = 'Perlu Perbaikan';
                  }

                  return (
                    <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-white rounded-lg px-4 py-2 border">
                          <div className="text-xs text-gray-500">Percobaan</div>
                          <div className="text-lg font-bold text-gray-800">#{attemptHistory.length - index}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            {attempt.selesai_at && new Date(attempt.selesai_at).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className={`text-xs font-medium ${nilaiColor}`}>
                            {nilaiGrade}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-3xl font-bold ${nilaiColor}`}>
                          {nilai.toFixed(1)}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/hasil/${attempt.id}`}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition text-center"
                          >
                            Hasil
                          </Link>
                          <Link
                            href={`/pembahasan/${attempt.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition text-center"
                          >
                            Pembahasan
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

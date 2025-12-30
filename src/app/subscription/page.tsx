import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDateOnly } from '@/lib/utils';
import Link from 'next/link';
import { SUBSCRIPTION_PRICE, SUBSCRIPTION_DURATION_DAYS } from '@/lib/constants';
import SubscribeButton from './SubscribeButton';

export default async function SubscriptionPage() {
  const user = await requireAuth();
  
  // Fetch user with subscription info
  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      nama: true,
      email: true,
      isPremium: true,
      subscriptionStatus: true,
      subscriptionStart: true,
      subscriptionEnd: true,
    }
  });

  // Check if subscription is active
  const isSubscriptionActive = currentUser?.subscriptionStatus === 'active' 
    && currentUser?.subscriptionEnd 
    && new Date(currentUser.subscriptionEnd) > new Date();

  // Count packages
  const packageCount = await prisma.package.count({
    where: { is_active: true }
  });

  const premiumPackageCount = await prisma.package.count({
    where: { 
      is_active: true,
      is_free: false
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              ← Kembali
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              💎 Langganan Premium
            </h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Current Status */}
          {isSubscriptionActive && currentUser?.subscriptionEnd && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white mb-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <span className="text-4xl">✅</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Status: Premium Aktif</h2>
                  <p className="text-white/90 mb-4">
                    Anda memiliki akses ke semua paket premium hingga:
                  </p>
                  <p className="text-2xl font-bold">
                    {new Date(currentUser.subscriptionEnd).toLocaleDateString('id-ID', { 
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-white/75 mt-2">
                    Mulai: {formatDateOnly(currentUser.subscriptionStart!)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
              <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🔥 Penawaran Terbaik
              </div>
              <h2 className="text-4xl font-bold mb-2">Langganan Premium</h2>
              <p className="text-white/90">Akses tanpa batas ke semua paket tryout</p>
            </div>

            {/* Price */}
            <div className="p-8 text-center border-b">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-800">
                  Rp {SUBSCRIPTION_PRICE.toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-gray-600">per bulan ({SUBSCRIPTION_DURATION_DAYS} hari)</p>
            </div>

            {/* Features */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Yang Anda Dapatkan:
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Akses ke {premiumPackageCount} Paket Premium</p>
                    <p className="text-sm text-gray-600">Semua simulasi dan latihan UKMPPD</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">16 Kategori Sistem UKMPPD</p>
                    <p className="text-sm text-gray-600">Dari Basic Medical Science hingga Gawat Darurat</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Tryout Tanpa Batas</p>
                    <p className="text-sm text-gray-600">Kerjakan paket sebanyak yang Anda mau</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Pembahasan Lengkap</p>
                    <p className="text-sm text-gray-600">Setiap soal dilengkapi pembahasan detail</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Tracking Progress</p>
                    <p className="text-sm text-gray-600">Monitor perkembangan belajar Anda</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Update Konten Rutin</p>
                    <p className="text-sm text-gray-600">Dapatkan soal-soal terbaru setiap bulan</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              {!isSubscriptionActive && (
                <SubscribeButton userId={user.id} />
              )}

              {isSubscriptionActive && (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Langganan Anda sudah aktif!</p>
                  <Link
                    href="/dashboard"
                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                  >
                    Mulai Belajar →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* FAQ or Info */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Informasi Penting</h3>
            <div className="space-y-3 text-gray-600">
              <p>✅ Pembayaran aman melalui Midtrans (QRIS, Transfer Bank, E-Wallet)</p>
              <p>✅ Akses langsung aktif setelah pembayaran berhasil</p>
              <p>✅ Berlaku selama {SUBSCRIPTION_DURATION_DAYS} hari sejak tanggal pembayaran</p>
              <p>✅ Perpanjangan mudah, tidak ada auto-renewal</p>
              <p>✅ Bisa dibatalkan kapan saja</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

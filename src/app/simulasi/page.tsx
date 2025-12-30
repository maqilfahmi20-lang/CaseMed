import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDateOnly } from '@/lib/utils';
import Link from 'next/link';
import { SUBSCRIPTION_PRICE } from '@/lib/constants';

export default async function SimulasiPage() {
  const user = await requireAuth();
  
  // Fetch user with subscription info
  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      isPremium: true,
      subscriptionStatus: true,
      subscriptionEnd: true,
    }
  });

  // Check if subscription is active
  const isSubscriptionActive = currentUser?.subscriptionStatus === 'active' 
    && currentUser?.subscriptionEnd 
    && new Date(currentUser.subscriptionEnd) > new Date();
  
  // Fetch simulasi packages - simple numbered list
  const packages = await prisma.package.findMany({
    where: { 
      is_active: true,
      tipe_paket: 'simulasi'
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      nama: true,
      tipe_paket: true,
      kategori: true,
      total_soal: true,
      max_attempt: true,
      is_free: true,
      harga: true,
      is_active: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { questions: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              ← Kembali
            </Link>
            <h1 className="text-2xl font-bold text-orange-600">🏥 Simulasi UKMPPD</h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white mb-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Simulasi UKMPPD</h2>
            <p className="text-white/90">Pilih paket simulasi ujian yang ingin Anda kerjakan</p>
            {!isSubscriptionActive && (
              <div className="mt-4 bg-white/20 rounded-lg p-4">
                <p className="font-semibold mb-2">💎 Langganan Premium</p>
                <p className="text-sm mb-3">Akses SEMUA paket simulasi & latihan dengan berlangganan Rp {SUBSCRIPTION_PRICE.toLocaleString('id-ID')}/bulan</p>
                <Link 
                  href="/subscription"
                  className="inline-block bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  Berlangganan Sekarang
                </Link>
              </div>
            )}
            {isSubscriptionActive && currentUser?.subscriptionEnd && (
              <div className="mt-4 bg-white/20 rounded-lg p-4">
                <p className="font-semibold">✅ Status: Premium Aktif</p>
                <p className="text-sm">Berlaku hingga: {formatDateOnly(currentUser.subscriptionEnd)}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Paket</p>
                  <p className="text-2xl font-bold text-orange-600">{packages.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-2xl">🆓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paket Gratis</p>
                  <p className="text-2xl font-bold text-green-600">
                    {packages.filter(p => p.is_free).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paket Premium</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {packages.filter(p => !p.is_free).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Daftar Paket Simulasi</h3>
            
            {packages.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">Belum ada paket simulasi tersedia</p>
              </div>
            ) : (
              <div className="space-y-3">
                {packages.map((pkg, index) => {
                  const needsSubscription = !pkg.is_free && !isSubscriptionActive;
                  
                  return (
                    <Link
                      key={pkg.id}
                      href={needsSubscription ? '/subscription' : `/paket/${pkg.id}`}
                      className={`
                        block bg-gradient-to-r p-4 rounded-lg border-2 transition-all
                        ${pkg.is_free 
                          ? 'from-green-50 to-green-100 border-green-200 hover:border-green-400 hover:shadow-md' 
                          : needsSubscription
                            ? 'from-gray-50 to-gray-100 border-gray-200 hover:border-gray-300 opacity-75'
                            : 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-400 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`
                            font-bold text-xl rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0
                            ${pkg.is_free 
                              ? 'bg-green-500 text-white' 
                              : needsSubscription 
                                ? 'bg-gray-400 text-white'
                                : 'bg-orange-500 text-white'
                            }
                          `}>
                            {index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-800">Paket {index + 1}</h4>
                              {pkg.is_free ? (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                  GRATIS
                                </span>
                              ) : (
                                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                  PREMIUM
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <span>📝</span>
                                <span>{pkg.total_soal} soal</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {needsSubscription ? (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Butuh Langganan</p>
                              <p className="text-sm font-semibold text-purple-600">Subscribe →</p>
                            </div>
                          ) : (
                            <div className="text-right">
                              <p className="text-sm font-semibold text-orange-600">Mulai →</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

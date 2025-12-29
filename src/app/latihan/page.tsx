import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function LatihanPage() {
  const user = await requireAuth();
  
  // Fetch current user with subscription info
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

  // Fetch all latihan packages
  const packages = await prisma.package.findMany({
    where: { 
      is_active: true,
      tipe_paket: 'latihan'
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
      _count: {
        select: { questions: true }
      }
    }
  });

  // Count packages by type
  const totalPackages = packages.length;
  const freePackages = packages.filter(p => p.is_free).length;
  const premiumPackages = totalPackages - freePackages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              ← Kembali
            </Link>
            <h1 className="text-2xl font-bold text-green-600">📝 Latihan Soal</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Subscription Status */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white mb-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Latihan Soal UKMPPD</h2>
            <p className="text-white/90 mb-4">Asah kemampuanmu dengan latihan soal</p>
            
            {isSubscriptionActive ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <div className="font-semibold">Akses Premium Aktif</div>
                    <div className="text-sm text-white/80">
                      Berlaku hingga {new Date(currentUser.subscriptionEnd!).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <div className="font-semibold">Upgrade ke Premium</div>
                      <div className="text-sm text-white/80">
                        Akses {premiumPackages} paket premium hanya Rp 55.000/bulan
                      </div>
                    </div>
                  </div>
                  <Link href="/subscription">
                    <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition">
                      Subscribe →
                    </button>
                  </Link>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{totalPackages}</div>
                <div className="text-sm text-white/80">Total Paket</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{freePackages}</div>
                <div className="text-sm text-white/80">Gratis</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{premiumPackages}</div>
                <div className="text-sm text-white/80">Premium</div>
              </div>
            </div>
          </div>

          {/* Packages List - Numbered */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => {
              const isPremium = !pkg.is_free && (pkg.harga || 0) > 0;
              const hasAccess = pkg.is_free || isSubscriptionActive;

              return (
                <Link
                  key={pkg.id}
                  href={hasAccess ? `/paket/${pkg.id}` : '/subscription'}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border-2 ${
                    hasAccess 
                      ? 'border-green-200 hover:border-green-400' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Package Number Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${
                      isPremium 
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                        : 'bg-gradient-to-br from-green-400 to-green-600'
                    } text-white font-bold text-lg rounded-full w-12 h-12 flex items-center justify-center shadow-lg`}>
                      {index + 1}
                    </div>
                    
                    {isPremium && (
                      <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {hasAccess ? '✨ Premium' : '🔒 Premium'}
                      </div>
                    )}
                    
                    {pkg.is_free && (
                      <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        🎁 Gratis
                      </div>
                    )}
                  </div>

                  {/* Package Info */}
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                    {pkg.nama}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <span>📝</span>
                      <span>{pkg._count.questions} soal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🔄</span>
                      <span>{pkg.max_attempt}x</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className={`text-center py-2 rounded-lg font-semibold ${
                    hasAccess
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {hasAccess ? 'Mulai Latihan →' : 'Subscribe →'}
                  </div>
                </Link>
              );
            })}
          </div>

          {packages.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg border p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada paket latihan</h3>
              <p className="text-gray-600">Admin sedang menyiapkan paket untuk Anda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

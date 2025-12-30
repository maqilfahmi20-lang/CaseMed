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

  // Fetch user attempts for track record
  const userAttempts = await prisma.userAttempt.findMany({
    where: {
      user_id: user.id,
      package: {
        tipe_paket: 'latihan'
      }
    },
    select: {
      id: true,
      package_id: true,
      attempt_ke: true,
      nilai: true,
      mulai_at: true,
      selesai_at: true,
    },
    orderBy: { mulai_at: 'desc' }
  });

  // Group packages by kategori
  const packagesByKategori = packages.reduce((acc, pkg) => {
    const kategori = pkg.kategori || 'Lainnya';
    if (!acc[kategori]) {
      acc[kategori] = [];
    }
    acc[kategori].push(pkg);
    return acc;
  }, {} as Record<string, typeof packages>);

  // Sort each kategori's packages by name
  Object.keys(packagesByKategori).forEach(kategori => {
    packagesByKategori[kategori].sort((a, b) => {
      // Extract number from package name (e.g., "Paket 1" -> 1)
      const numA = parseInt(a.nama.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.nama.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });
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

          {/* Packages List - Grouped by Kategori */}
          <div className="space-y-8">
            {Object.entries(packagesByKategori).map(([kategori, kategoriPackages]) => (
              <div key={kategori} className="bg-white rounded-xl shadow-lg border-2 border-green-200 overflow-hidden">
                {/* Kategori Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>📚</span>
                    <span>{kategori}</span>
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {kategoriPackages.length} paket latihan tersedia
                  </p>
                </div>

                {/* Packages in Kategori - Vertical List */}
                <div className="p-6 space-y-4">
                  {kategoriPackages.map((pkg, index) => {
                    const isPremium = !pkg.is_free && (pkg.harga || 0) > 0;
                    const hasAccess = pkg.is_free || isSubscriptionActive;
                    const packageAttempts = userAttempts.filter(a => a.package_id === pkg.id);

                    return (
                      <div
                        key={pkg.id}
                        className={`border-2 rounded-lg p-5 transition-all ${
                          hasAccess 
                            ? 'border-green-200 hover:border-green-400 hover:shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Left: Package Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {/* Package Number */}
                              <div className={`${
                                isPremium 
                                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                                  : 'bg-gradient-to-br from-green-400 to-green-600'
                              } text-white font-bold text-sm rounded-lg w-10 h-10 flex items-center justify-center shadow`}>
                                {index + 1}
                              </div>

                              {/* Package Name */}
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-lg">
                                  Paket {index + 1}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <span>📝</span>
                                    <span>{pkg._count.questions} soal</span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span>🔄</span>
                                    <span>{pkg.max_attempt}x</span>
                                  </span>
                                </div>
                              </div>

                              {/* Badge */}
                              {isPremium && (
                                <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                                  {hasAccess ? '✨ Premium' : '🔒 Premium'}
                                </div>
                              )}
                              {pkg.is_free && (
                                <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                                  🎁 Gratis
                                </div>
                              )}
                            </div>

                            {/* Track Record */}
                            {packageAttempts.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  <span>📊</span>
                                  <span>Track Record:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {packageAttempts.map((attempt) => (
                                    <Link
                                      key={attempt.id}
                                      href={`/hasil/${attempt.id}`}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-2"
                                    >
                                      <span>Attempt {attempt.attempt_ke}:</span>
                                      <span className="font-bold">
                                        {attempt.nilai !== null ? `${attempt.nilai.toFixed(0)}` : 'Belum Selesai'}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right: CTA Button */}
                          <Link
                            href={hasAccess ? `/paket/${pkg.id}` : '/subscription'}
                            className={`px-6 py-3 rounded-lg font-semibold text-center whitespace-nowrap transition ${
                              hasAccess
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                          >
                            {hasAccess ? 'Mulai →' : 'Subscribe'}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function LatihanKategoriPage({ 
  params 
}: { 
  params: { kategori: string } 
}) {
  const user = await requireAuth();
  const kategori = decodeURIComponent(params.kategori);
  
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

  // Fetch packages for this kategori
  const packages = await prisma.package.findMany({
    where: { 
      is_active: true,
      tipe_paket: 'latihan',
      kategori: kategori === 'Lainnya' ? null : kategori
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

  if (packages.length === 0) {
    notFound();
  }

  // Sort packages by number
  packages.sort((a, b) => {
    const numA = parseInt(a.nama.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.nama.match(/\d+/)?.[0] || '0');
    return numA - numB;
  });

  // Fetch user attempts for track record
  const userAttempts = await prisma.userAttempt.findMany({
    where: {
      user_id: user.id,
      package_id: { in: packages.map(p => p.id) }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/latihan" className="text-gray-600 hover:text-gray-800">
              ← Kembali ke Latihan
            </Link>
            <h1 className="text-2xl font-bold text-green-600">📚 {kategori}</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white mb-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">{kategori}</h2>
            <p className="text-white/90 mb-4">
              {packages.length} paket latihan tersedia
            </p>
            
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
                        Akses semua paket hanya Rp 55.000/bulan
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
          </div>

          {/* Packages List */}
          <div className="space-y-4">
            {packages.map((pkg, index) => {
              const isPremium = !pkg.is_free && (pkg.harga || 0) > 0;
              const hasAccess = pkg.is_free || isSubscriptionActive;
              const packageAttempts = userAttempts.filter(a => a.package_id === pkg.id);

              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-lg shadow-md border-2 p-5 transition-all ${
                    hasAccess 
                      ? 'border-green-200 hover:border-green-400 hover:shadow-lg' 
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
      </div>
    </div>
  );
}

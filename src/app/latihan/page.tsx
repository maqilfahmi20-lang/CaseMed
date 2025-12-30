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

  // Fetch all latihan packages to get unique categories
  const packages = await prisma.package.findMany({
    where: { 
      is_active: true,
      tipe_paket: 'latihan'
    },
    select: {
      kategori: true,
    }
  });

  // Get unique categories
  const uniqueKategori = Array.from(new Set(packages.map(p => p.kategori || 'Lainnya')));
  
  // Count packages per category
  const kategoriWithCounts = await Promise.all(
    uniqueKategori.map(async (kategori) => {
      const count = await prisma.package.count({
        where: {
          is_active: true,
          tipe_paket: 'latihan',
          kategori: kategori === 'Lainnya' ? null : kategori
        }
      });
      return { kategori, count };
    })
  );

  // Count packages by type
  const totalPackages = packages.length;
  const premiumPackages = await prisma.package.count({
    where: {
      is_active: true,
      tipe_paket: 'latihan',
      is_free: false,
      harga: { gt: 0 }
    }
  });
  const freePackages = totalPackages - premiumPackages;

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

          {/* Packages List - Grouped by Kategori with Accordion */}
          <div className="space-y-6">
            {kategoriWithCounts.map(({ kategori, count }) => (
              <Link
                key={kategori}
                href={`/latihan/${encodeURIComponent(kategori)}`}
                className="block bg-white rounded-xl shadow-lg border-2 border-green-200 overflow-hidden hover:border-green-400 hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5 hover:from-green-600 hover:to-green-700 transition">
                  <div className="flex items-center justify-between">
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>📚</span>
                        <span>{kategori}</span>
                      </h3>
                      <p className="text-white/80 text-sm mt-1">
                        {count} paket latihan tersedia
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">
                        Lihat Paket
                      </span>
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {kategoriWithCounts.length === 0 && (
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

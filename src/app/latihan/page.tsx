import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { KATEGORI_UKMPPD } from '@/lib/constants';

export default async function LatihanPage() {
  const user = await requireAuth();
  
  // Group packages by kategori
  const packages = await prisma.package.findMany({
    where: { 
      is_active: true,
      tipe_paket: 'latihan'
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { questions: true }
      }
    }
  });

  // Group by kategori
  const groupedPackages = packages.reduce((acc, pkg) => {
    const kategori = pkg.kategori || 'Lainnya';
    if (!acc[kategori]) acc[kategori] = [];
    acc[kategori].push(pkg);
    return acc;
  }, {} as Record<string, typeof packages>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              ← Kembali
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">📝 Latihan UKMPPD</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white mb-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Latihan UKMPPD per Sistem</h2>
            <p className="text-white/90">Pilih kategori sistem untuk berlatih soal</p>
          </div>

          {/* 16 Kategori */}
          {KATEGORI_UKMPPD.map((kategori, index) => {
            const kategoriPackages = groupedPackages[kategori] || [];
            
            return (
              <div key={index} className="mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 font-bold text-xl rounded-full w-12 h-12 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{kategori}</h3>
                        <p className="text-sm text-gray-600">{kategoriPackages.length} paket tersedia</p>
                      </div>
                    </div>
                  </div>

                  {kategoriPackages.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-500">Belum ada paket untuk kategori ini</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {kategoriPackages.map((pkg) => (
                        <Link
                          key={pkg.id}
                          href={`/paket/${pkg.id}`}
                          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
                        >
                          <h4 className="font-bold text-gray-800 mb-2">{pkg.nama}</h4>
                          
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <span>📝</span>
                              <span><strong>{pkg._count.questions}</strong> soal</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>🔄</span>
                              <span><strong>{pkg.max_attempt}x</strong></span>
                            </div>
                          </div>

                          <div className="bg-white rounded px-3 py-2 text-center">
                            <span className="font-bold text-blue-600">
                              {pkg.harga === 0 ? 'GRATIS' : `Rp ${(pkg.harga || 0).toLocaleString('id-ID')}`}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

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

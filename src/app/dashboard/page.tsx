import { requireAuth } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await requireAuth();
  
  // Fetch user attempts
  const attempts = await prisma.userAttempt.count({
    where: { user_id: user.id }
  });

  const avgNilai = await prisma.userAttempt.aggregate({
    where: { 
      user_id: user.id,
      nilai: { not: null }
    },
    _avg: { nilai: true }
  });

  // Fetch recent attempts with package info
  const recentAttempts = await prisma.userAttempt.findMany({
    where: { 
      user_id: user.id,
      selesai_at: { not: null }
    },
    include: {
      package: true
    },
    orderBy: { selesai_at: 'desc' },
    take: 5
  });

  // Fetch available packages
  const packages = await prisma.package.findMany({
    where: { is_active: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { questions: true }
      }
    }
  });

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
            <h1 className="text-2xl font-bold text-blue-600">CaseMed</h1>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white mb-8">
            <h2 className="text-3xl font-bold mb-2">Selamat Datang, {user.nama}!</h2>
            <p className="text-white/90">Mulai latihan hari ini</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-gray-800">{packages.length}</div>
              <div className="text-gray-600">Paket Tersedia</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-gray-800">{attempts}</div>
              <div className="text-gray-600">Ujian Dikerjakan</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-gray-800">
                {avgNilai._avg.nilai ? avgNilai._avg.nilai.toFixed(1) : '-'}
              </div>
              <div className="text-gray-600">Nilai Rata-rata</div>
            </div>
          </div>

          {/* Paket List */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Paket Latihan & UKMPPD</h3>
            
            {packages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada paket</h3>
                <p className="text-gray-600">Admin sedang menyiapkan paket untuk Anda</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          pkg.tipe_paket === 'ukmppd' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {pkg.tipe_paket.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {pkg.harga === 0 ? 'GRATIS' : `Rp ${(pkg.harga || 0).toLocaleString('id-ID')}`}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-800 mb-2">{pkg.nama}</h4>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <span>📝</span>
                        <span>{pkg._count.questions} soal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🔄</span>
                        <span>Max {pkg.max_attempt}x</span>
                      </div>
                    </div>

                    <Link
                      href={`/paket/${pkg.id}`}
                      className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Riwayat Ujian */}
          {recentAttempts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Ujian Terbaru</h3>
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {recentAttempts.map((attempt) => {
                    const nilai = attempt.nilai || 0;
                    let nilaiColor = 'text-gray-600';
                    if (nilai >= 80) nilaiColor = 'text-green-600';
                    else if (nilai >= 70) nilaiColor = 'text-blue-600';
                    else if (nilai >= 60) nilaiColor = 'text-yellow-600';
                    else nilaiColor = 'text-red-600';

                    return (
                      <div key={attempt.id} className="p-4 hover:bg-gray-50 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                attempt.package.tipe_paket === 'ukmppd'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {attempt.package.tipe_paket.toUpperCase()}
                              </span>
                              <h4 className="font-semibold text-gray-800">{attempt.package.nama}</h4>
                            </div>
                            <p className="text-sm text-gray-500">
                              {attempt.selesai_at && new Date(attempt.selesai_at).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${nilaiColor}`}>
                                {nilai.toFixed(0)}
                              </div>
                              <div className="text-xs text-gray-500">Nilai</div>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/hasil/${attempt.id}`}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                              >
                                Hasil
                              </Link>
                              <Link
                                href={`/pembahasan/${attempt.id}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                              >
                                Pembahasan
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

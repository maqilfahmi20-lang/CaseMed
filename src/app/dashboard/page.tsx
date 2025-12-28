import { requireAuth } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { KATEGORI_UKMPPD } from '@/lib/constants';

export default async function DashboardPage() {
  const user = await requireAuth();
  
  // Fetch current user with subscription info
  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      nama: true,
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
  
  // Fetch user stats
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

  // Count packages by type
  const simulasiCount = await prisma.package.count({
    where: { is_active: true, tipe_paket: 'simulasi' }
  });

  const latihanCount = await prisma.package.count({
    where: { is_active: true, tipe_paket: 'latihan' }
  });

  const handleLogout = async () => {
    'use server';
    await logoutAction();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">🩺 CaseMed</h1>
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
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white mb-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Selamat Datang, {user.nama}! 👋</h2>
            <p className="text-white/90">Pilih mode latihan Anda</p>
          </div>

          {/* Subscription Status Card */}
          {isSubscriptionActive && currentUser?.subscriptionEnd ? (
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <span className="text-3xl">💎</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Status: Premium Aktif</h3>
                    <p className="text-white/90 text-sm">
                      Berlaku hingga: {new Date(currentUser.subscriptionEnd).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <Link
                  href="/subscription"
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                >
                  Detail →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <span className="text-3xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Upgrade ke Premium</h3>
                    <p className="text-white/90 text-sm">
                      Akses semua paket simulasi & latihan hanya Rp 55.000/bulan
                    </p>
                  </div>
                </div>
                <Link
                  href="/subscription"
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                >
                  Berlangganan →
                </Link>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-3xl font-bold text-gray-800">{attempts}</div>
              <div className="text-gray-600 text-sm">Ujian Dikerjakan</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="text-4xl mb-3">⭐</div>
              <div className="text-3xl font-bold text-gray-800">
                {avgNilai._avg.nilai ? avgNilai._avg.nilai.toFixed(1) : '-'}
              </div>
              <div className="text-gray-600 text-sm">Nilai Rata-rata</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="text-4xl mb-3">📚</div>
              <div className="text-3xl font-bold text-gray-800">{simulasiCount + latihanCount}</div>
              <div className="text-gray-600 text-sm">Total Paket</div>
            </div>
          </div>

          {/* Main Menu - 2 Kolom */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Simulasi UKMPPD */}
            <Link
              href="/simulasi"
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="text-6xl mb-6">🏥</div>
              <h3 className="text-3xl font-bold mb-3">Simulasi UKMPPD</h3>
              <p className="text-white/90 mb-6 text-lg">
                Ujian simulasi lengkap seperti UKMPPD asli dengan 150 soal
              </p>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/90">Jumlah Paket</span>
                  <span className="font-bold text-xl">{simulasiCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Durasi</span>
                  <span className="font-bold text-xl">3-4 Jam</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-lg px-6 py-4">
                <span className="font-semibold text-lg">Mulai Simulasi</span>
                <span className="text-2xl">→</span>
              </div>
            </Link>

            {/* Latihan UKMPPD */}
            <Link
              href="/latihan"
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-3xl font-bold mb-3">Latihan Soal</h3>
              <p className="text-white/90 mb-6 text-lg">
                Latihan per paket dengan 16 kategori materi UKMPPD
              </p>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/90">Jumlah Paket</span>
                  <span className="font-bold text-xl">{latihanCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Kategori</span>
                  <span className="font-bold text-xl">16 Materi</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-lg px-6 py-4">
                <span className="font-semibold text-lg">Mulai Latihan</span>
                <span className="text-2xl">→</span>
              </div>
            </Link>
          </div>

          {/* 16 Kategori Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">16 Kategori Latihan UKMPPD</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {KATEGORI_UKMPPD.map((kategori, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition"
                >
                  <div className="text-2xl mb-2">{index + 1}</div>
                  <div className="text-sm font-medium text-gray-700">{kategori}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

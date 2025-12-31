import { requireAuth } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
import { formatDateOnly, formatDateTime } from '@/lib/utils';
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

  // Fetch recent attempts with track record
  const recentAttempts = await prisma.userAttempt.findMany({
    where: {
      user_id: user.id,
      selesai_at: { not: null }
    },
    include: {
      package: {
        select: {
          nama: true,
          tipe_paket: true,
          kategori: true
        }
      }
    },
    orderBy: { selesai_at: 'desc' },
    take: 10
  });

  const handleLogout = async () => {
    'use server';
    await logoutAction();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">🩺 CaseMed</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-sm sm:text-base text-gray-700 hidden sm:inline">Halo, {user.nama}</span>
              <span className="text-sm text-gray-700 sm:hidden">{user.nama}</span>
              <form action={handleLogout}>
                <button
                  type="submit"
                  className="text-sm sm:text-base text-gray-600 hover:text-gray-800 transition px-2 sm:px-0"
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 sm:p-8 text-white mb-6 sm:mb-8 shadow-lg">
            <h2 className="text-xl sm:text-3xl font-bold mb-2">Selamat Datang, {user.nama}! 👋</h2>
            <p className="text-sm sm:text-base text-white/90">Pilih mode latihan Anda</p>
          </div>

          {/* Subscription Status Card */}
          {isSubscriptionActive && currentUser?.subscriptionEnd ? (
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white mb-6 sm:mb-8 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-white/20 p-2 sm:p-3 rounded-full">
                    <span className="text-2xl sm:text-3xl">💎</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-bold mb-1">Status: Premium Aktif</h3>
                    <p className="text-white/90 text-xs sm:text-sm">
                      Berlaku hingga: {formatDateOnly(currentUser.subscriptionEnd)}
                    </p>
                  </div>
                </div>
                <Link
                  href="/subscription"
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
                >
                  Detail →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 overflow-hidden mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <span className="text-xl sm:text-2xl">💎</span>
                    </div>
                    <div>
                      <h3 className="text-white text-base sm:text-lg font-bold">Paket Premium CaseMed</h3>
                      <p className="text-white/90 text-xs sm:text-sm">Akses unlimited semua fitur</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg border border-white/30">
                      <div className="text-yellow-300 text-xs font-semibold uppercase tracking-wide">💰 Harga Spesial</div>
                      <div className="text-white text-2xl sm:text-3xl font-bold">Rp 55.000</div>
                      <div className="text-white/80 text-xs sm:text-sm">per bulan</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm sm:text-base">Akses Semua Paket</div>
                        <div className="text-xs sm:text-sm text-gray-600">{simulasiCount + latihanCount} paket simulasi & latihan</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-800">1000+ Soal Premium</div>
                        <div className="text-sm text-gray-600">Update rutin setiap minggu</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-800">Pembahasan Detail</div>
                        <div className="text-sm text-gray-600">Penjelasan lengkap setiap jawaban</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-800">Simulasi CBT</div>
                        <div className="text-sm text-gray-600">Seperti ujian UKMPPD asli</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-800">Track Record</div>
                        <div className="text-sm text-gray-600">Monitor progress belajar</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-800">Unlimited Attempt</div>
                        <div className="text-sm text-gray-600">Tanpa batas percobaan</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-purple-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                        🔥 HEMAT 94%
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-gray-600">Beli satuan:</div>
                        <div className="text-base sm:text-xl font-bold text-gray-800 line-through">Rp 900.000</div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xs sm:text-sm text-gray-600">Dengan subscribe:</div>
                      <div className="text-2xl sm:text-3xl font-bold text-purple-600">Rp 55.000</div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/subscription"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  🚀 Berlangganan Sekarang - Rp 55.000/bulan
                </Link>
                
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
                  💳 Pembayaran aman via Midtrans • QRIS, Transfer Bank, E-Wallet
                </p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎯</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">{attempts}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Ujian Dikerjakan</div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⭐</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                {avgNilai._avg.nilai ? avgNilai._avg.nilai.toFixed(1) : '-'}
              </div>
              <div className="text-gray-600 text-xs sm:text-sm">Nilai Rata-rata</div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📚</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">{simulasiCount + latihanCount}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Total Paket</div>
            </div>
          </div>

          {/* Main Menu - 2 Kolom */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
            {/* Simulasi UKMPPD */}
            <Link
              href="/simulasi"
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🏫</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Simulasi UKMPPD</h3>
              <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-lg">
                Ujian simulasi lengkap seperti UKMPPD asli dengan 150 soal
              </p>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/90 text-sm sm:text-base">Jumlah Paket</span>
                  <span className="font-bold text-lg sm:text-xl">{simulasiCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm sm:text-base">Durasi</span>
                  <span className="font-bold text-lg sm:text-xl">200 menit</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-lg px-4 sm:px-6 py-3 sm:py-4">
                <span className="font-semibold text-base sm:text-lg">Mulai Simulasi</span>
                <span className="text-xl sm:text-2xl">→</span>
              </div>
            </Link>

            {/* Latihan UKMPPD */}
            <Link
              href="/latihan"
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">📝</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Latihan Soal</h3>
              <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-lg">
                Latihan per paket dengan 16 kategori materi UKMPPD
              </p>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/90 text-sm sm:text-base">Jumlah Paket</span>
                  <span className="font-bold text-lg sm:text-xl">{latihanCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm sm:text-base">Kategori</span>
                  <span className="font-bold text-lg sm:text-xl">16 Materi</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-lg px-4 sm:px-6 py-3 sm:py-4">
                <span className="font-semibold text-base sm:text-lg">Mulai Latihan</span>
                <span className="text-xl sm:text-2xl">→</span>
              </div>
            </Link>
          </div>

          {/* Track Record Section */}
          {recentAttempts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span>📊</span>
                  <span>Track Record Terbaru</span>
                </h3>
                <span className="text-xs sm:text-sm text-gray-500">
                  {recentAttempts.length} Ujian Terakhir
                </span>
              </div>
              
              <div className="space-y-3">
                {recentAttempts.map((attempt, index) => {
                  const nilai = attempt.nilai || 0;
                  let nilaiColor = 'text-gray-600';
                  let bgColor = 'bg-gray-50';
                  let badgeColor = 'bg-gray-100 text-gray-700';
                  let nilaiGrade = '';
                  
                  if (nilai >= 80) {
                    nilaiColor = 'text-green-600';
                    bgColor = 'bg-green-50';
                    badgeColor = 'bg-green-100 text-green-700';
                    nilaiGrade = 'Sangat Baik';
                  } else if (nilai >= 70) {
                    nilaiColor = 'text-blue-600';
                    bgColor = 'bg-blue-50';
                    badgeColor = 'bg-blue-100 text-blue-700';
                    nilaiGrade = 'Baik';
                  } else if (nilai >= 60) {
                    nilaiColor = 'text-yellow-600';
                    bgColor = 'bg-yellow-50';
                    badgeColor = 'bg-yellow-100 text-yellow-700';
                    nilaiGrade = 'Cukup';
                  } else {
                    nilaiColor = 'text-red-600';
                    bgColor = 'bg-red-50';
                    badgeColor = 'bg-red-100 text-red-700';
                    nilaiGrade = 'Perlu Perbaikan';
                  }

                  return (
                    <div key={attempt.id} className={`${bgColor} rounded-lg p-3 sm:p-4 border-2 border-transparent hover:border-blue-300 transition`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
                          {/* Attempt Number */}
                          <div className="bg-white rounded-lg px-2 sm:px-4 py-1 sm:py-2 border shadow-sm flex-shrink-0">
                            <div className="text-xs text-gray-500">#{index + 1}</div>
                            <div className="text-xs sm:text-sm font-bold text-gray-800">
                              Attempt {attempt.attempt_ke}
                            </div>
                          </div>
                          
                          {/* Package Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                                attempt.package.tipe_paket === 'simulasi' 
                                  ? 'bg-orange-100 text-orange-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {attempt.package.tipe_paket.toUpperCase()}
                              </span>
                              {attempt.package.kategori && (
                                <span className="text-xs text-gray-500">
                                  {attempt.package.kategori}
                                </span>
                              )}
                            </div>
                            <div className="font-semibold text-gray-800 mb-1 text-sm sm:text-base truncate">
                              {attempt.package.nama}
                            </div>
                            <div className="text-xs text-gray-500">
                              {attempt.selesai_at && formatDateTime(attempt.selesai_at)}
                            </div>
                          </div>
                        </div>

                        {/* Score and Grade */}
                        <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 w-full sm:w-auto">
                          <div className={`text-2xl sm:text-3xl font-bold ${nilaiColor}`}>
                            {nilai.toFixed(0)}
                          </div>
                          <div className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor}`}>
                            {nilaiGrade}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                        <Link
                          href={`/hasil/${attempt.id}`}
                          className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-700 transition text-center"
                        >
                          Hasil
                        </Link>
                        <Link
                          href={`/pembahasan/${attempt.id}`}
                          className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition text-center"
                        >
                          Pembahasan
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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

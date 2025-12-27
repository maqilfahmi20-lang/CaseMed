import { requireAdmin } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  
  // Fetch real stats from database
  const [totalQuestions, totalUsers, totalPackages, totalPayments] = await Promise.all([
    prisma.question.count(),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.package.count(),
    prisma.payment.count({ where: { status: 'paid' } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-gray-300">CaseMed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Halo, {admin.nama}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Link href="/admin/soal">
              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">📚</div>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{totalQuestions}</div>
                <div className="text-gray-600 text-sm">Soal Tersedia</div>
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">👥</div>
                  <span className="text-sm text-gray-500">User</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{totalUsers}</div>
                <div className="text-gray-600 text-sm">User Terdaftar</div>
              </div>
            </Link>

            <Link href="/admin/paket">
              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">📦</div>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{totalPackages}</div>
                <div className="text-gray-600 text-sm">Paket Tryout</div>
              </div>
            </Link>

            <Link href="/admin/payments">
              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">💰</div>
                  <span className="text-sm text-gray-500">Paid</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{totalPayments}</div>
                <div className="text-gray-600 text-sm">Pembayaran Sukses</div>
              </div>
            </Link>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/admin/soal/tambah">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white hover:shadow-xl transition cursor-pointer">
                <div className="text-5xl mb-4">➕</div>
                <h3 className="text-2xl font-bold mb-2">Tambah Soal Baru</h3>
                <p className="text-blue-100 mb-4">
                  Buat soal latihan atau ujian baru untuk ditampilkan ke user
                </p>
                <div className="bg-white text-blue-600 px-6 py-3 rounded-lg inline-block font-semibold">
                  Buat Soal →
                </div>
              </div>
            </Link>

            <Link href="/admin/soal">
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-8 text-white hover:shadow-xl transition cursor-pointer">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-2xl font-bold mb-2">Kelola Soal</h3>
                <p className="text-gray-200 mb-4">
                  Edit atau hapus soal yang sudah ada
                </p>
                <div className="bg-white text-gray-700 px-6 py-3 rounded-lg inline-block font-semibold">
                  Lihat Soal →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

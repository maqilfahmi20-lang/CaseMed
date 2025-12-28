import { requireAdmin } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

export default async function AdminPaketPage() {
  const admin = await requireAdmin();
  
  // Fetch packages grouped by type
  const simulasiPackages = await prisma.package.findMany({
    where: { tipe_paket: 'simulasi' },
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
        select: {
          questions: true,
          attempts: true,
        }
      }
    }
  });

  const latihanPackages = await prisma.package.findMany({
    where: { tipe_paket: 'latihan' },
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
        select: {
          questions: true,
          attempts: true,
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition">
              <span className="text-2xl">⚙️</span>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-gray-300">Kelola Paket</p>
              </div>
            </Link>
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Kelola Paket UKMPPD</h2>
              <p className="text-gray-600">
                Simulasi: {simulasiPackages.length} paket | 
                Latihan: {latihanPackages.length} paket
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ℹ️ Paket ditampilkan berurutan (Paket 1, 2, 3...) di user dashboard
              </p>
            </div>
            <Link
              href="/admin/paket/tambah"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              + Tambah Paket
            </Link>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Sistem Subscription Aktif</h4>
                <p className="text-sm text-gray-600">
                  User dengan subscription aktif dapat mengakses SEMUA paket premium tanpa perlu bayar per paket.
                  Paket GRATIS tetap bisa diakses semua user.
                </p>
              </div>
            </div>
          </div>

          {/* Simulasi UKMPPD Section */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                🏥 Simulasi UKMPPD
                <span className="text-lg font-normal">({simulasiPackages.length} paket)</span>
              </h3>
              <p className="text-white/80 text-sm mt-1">Urutan sesuai tampilan di user (Paket 1, 2, 3...)</p>
            </div>

            {simulasiPackages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-500">Belum ada paket simulasi</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-purple-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nama Paket</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Soal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tipe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {simulasiPackages.map((pkg, index) => (
                      <tr key={pkg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 font-bold rounded-full">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{pkg.nama}</div>
                          <div className="text-xs text-gray-500">ID: {pkg.id.slice(0, 8)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{pkg.kategori || '-'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {pkg._count.questions} / {pkg.total_soal}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {pkg.harga === 0 || pkg.is_free ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              🎁 GRATIS
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              💎 PREMIUM
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {pkg.is_active ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Nonaktif</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/paket/edit/${pkg.id}`} className="text-blue-600 hover:text-blue-900">
                            Edit
                          </Link>
                          <DeleteButton packageId={pkg.id} packageName={pkg.nama} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Latihan UKMPPD Section */}
          <div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                📝 Latihan Soal per Sistem
                <span className="text-lg font-normal">({latihanPackages.length} paket)</span>
              </h3>
              <p className="text-white/80 text-sm mt-1">Urutan sesuai tampilan di user (Paket 1, 2, 3...)</p>
            </div>

            {latihanPackages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-500">Belum ada paket latihan</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-green-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nama Paket</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Soal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tipe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {latihanPackages.map((pkg, index) => (
                      <tr key={pkg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 font-bold rounded-full">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{pkg.nama}</div>
                          <div className="text-xs text-gray-500">ID: {pkg.id.slice(0, 8)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {pkg.kategori || 'Lainnya'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {pkg._count.questions} / {pkg.total_soal}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {pkg.harga === 0 || pkg.is_free ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              🎁 GRATIS
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              💎 PREMIUM
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {pkg.is_active ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Nonaktif</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/paket/edit/${pkg.id}`} className="text-blue-600 hover:text-blue-900">
                            Edit
                          </Link>
                          <DeleteButton packageId={pkg.id} packageName={pkg.nama} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

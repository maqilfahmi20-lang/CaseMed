import { requireAdmin } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

const ITEMS_PER_PAGE = 20;

export default async function KelolaSoalPage({
  searchParams,
}: {
  searchParams: { page?: string; kategori?: string; search?: string; jenis_soal?: string };
}) {
  const admin = await requireAdmin();
  
  const page = Number(searchParams.page) || 1;
  const kategori = searchParams.kategori || '';
  const search = searchParams.search || '';
  const jenis_soal = searchParams.jenis_soal || '';

  // Build where clause
  const where: any = {};
  if (kategori) {
    where.kategori = kategori;
  }
  if (jenis_soal) {
    where.jenis_soal = jenis_soal;
  }
  if (search) {
    where.pertanyaan = { contains: search };
  }

  // Get total count
  const totalSoal = await prisma.question.count({ where });
  const totalPages = Math.ceil(totalSoal / ITEMS_PER_PAGE);

  // Get questions with pagination
  const soal = await prisma.question.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
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
                <p className="text-sm text-gray-300">Kelola Soal</p>
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Kelola Soal</h2>
              <p className="text-gray-600">Total: {totalSoal} soal</p>
            </div>
            <Link
              href="/admin/soal/tambah"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              + Tambah Soal
            </Link>
          </div>

          {/* Filter & Search */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <form method="get" className="flex gap-4">
              <select
                name="kategori"
                defaultValue={kategori}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Semua Kategori</option>
                <option value="latihan">Latihan</option>
                <option value="ukmppd">UKMPPD</option>
              </select>

              <select
                name="jenis_soal"
                defaultValue={searchParams.jenis_soal || ''}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Semua Jenis</option>
                <option value="matematika">Matematika</option>
                <option value="fisika">Fisika</option>
                <option value="kimia">Kimia</option>
                <option value="bahasa_indonesia">Bahasa Indonesia</option>
                <option value="bahasa_inggris">Bahasa Inggris</option>
              </select>

              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Cari pertanyaan..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />

              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Filter
              </button>

              {(kategori || search || searchParams.jenis_soal) && (
                <Link
                  href="/admin/soal"
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Reset
                </Link>
              )}
            </form>
          </div>

          {/* Table */}
          {soal.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada soal</h3>
              <p className="text-gray-600 mb-6">Mulai tambahkan soal untuk ditampilkan di sini</p>
              <Link
                href="/admin/soal/tambah"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Tambah Soal Pertama
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pertanyaan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jenis Soal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jawaban
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {soal.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2">
                            {item.pertanyaan}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.kategori === 'ukmppd' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.kategori}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.jenis_soal ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              {item.jenis_soal.replace('_', ' ')}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {item.jawaban_benar.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/soal/edit/${item.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </Link>
                            <DeleteButton id={item.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {page > 1 && (
                    <Link
                      href={`/admin/soal?page=${page - 1}${kategori ? `&kategori=${kategori}` : ''}${jenis_soal ? `&jenis_soal=${jenis_soal}` : ''}${search ? `&search=${search}` : ''}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      ← Prev
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/admin/soal?page=${p}${kategori ? `&kategori=${kategori}` : ''}${jenis_soal ? `&jenis_soal=${jenis_soal}` : ''}${search ? `&search=${search}` : ''}`}
                      className={`px-4 py-2 rounded-lg transition ${
                        p === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}

                  {page < totalPages && (
                    <Link
                      href={`/admin/soal?page=${page + 1}${kategori ? `&kategori=${kategori}` : ''}${jenis_soal ? `&jenis_soal=${jenis_soal}` : ''}${search ? `&search=${search}` : ''}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

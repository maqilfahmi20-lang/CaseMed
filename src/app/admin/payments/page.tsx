import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';

export default async function AdminPaymentsPage({
  searchParams
}: {
  searchParams: { status?: string }
}) {
  const user = await requireAuth();

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  const statusFilter = searchParams.status || 'all';

  // Fetch payments with filters
  const payments = await prisma.payment.findMany({
    where: statusFilter === 'all' ? {} : { status: statusFilter },
    include: {
      user: {
        select: {
          nama: true,
          email: true
        }
      },
      package: {
        select: {
          nama: true,
          tipe_paket: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Count by status
  const countPaid = await prisma.payment.count({ where: { status: 'paid' } });
  const countPending = await prisma.payment.count({ where: { status: 'pending' } });
  const countFailed = await prisma.payment.count({ where: { status: 'failed' } });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin/dashboard" className="text-2xl font-bold text-blue-600 hover:opacity-80">
              Admin Panel
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-800">
                Dashboard
              </Link>
              <Link href="/admin/paket" className="text-gray-600 hover:text-gray-800">
                Paket
              </Link>
              <Link href="/admin/soal" className="text-gray-600 hover:text-gray-800">
                Soal
              </Link>
              <Link href="/admin/users" className="text-gray-600 hover:text-gray-800">
                Users
              </Link>
              <Link href="/admin/payments" className="text-blue-600 font-semibold">
                Payments
              </Link>
              <span className="text-gray-700">{user.nama}</span>
              <form action={logoutAction}>
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

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Pembayaran</h1>
          <p className="text-gray-600">Monitor dan kelola pembayaran dari user</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">Paid</p>
                <p className="text-3xl font-bold text-green-700">{countPaid}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-700">{countPending}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-700">{countFailed}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">Filter Status:</span>
            <Link
              href="/admin/payments?status=all"
              className={`px-4 py-2 rounded-lg transition ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua ({countPaid + countPending + countFailed})
            </Link>
            <Link
              href="/admin/payments?status=paid"
              className={`px-4 py-2 rounded-lg transition ${
                statusFilter === 'paid'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paid ({countPaid})
            </Link>
            <Link
              href="/admin/payments?status=pending"
              className={`px-4 py-2 rounded-lg transition ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({countPending})
            </Link>
            <Link
              href="/admin/payments?status=failed"
              className={`px-4 py-2 rounded-lg transition ${
                statusFilter === 'failed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Failed ({countFailed})
            </Link>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Paket</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Jumlah</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      Tidak ada data pembayaran
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => {
                    let statusBadge = '';
                    let statusColor = '';
                    
                    if (payment.status === 'paid') {
                      statusBadge = '✅ Paid';
                      statusColor = 'bg-green-100 text-green-800';
                    } else if (payment.status === 'pending') {
                      statusBadge = '⏳ Pending';
                      statusColor = 'bg-yellow-100 text-yellow-800';
                    } else {
                      statusBadge = '❌ Failed';
                      statusColor = 'bg-red-100 text-red-800';
                    }

                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="text-sm font-mono text-gray-700">{payment.order_id}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-800">{payment.user.nama}</div>
                          <div className="text-xs text-gray-500">{payment.user.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          {payment.package ? (
                            <>
                              <div className="text-sm text-gray-700">{payment.package.nama}</div>
                              <div className="text-xs text-gray-500 uppercase">{payment.package.tipe_paket}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-sm font-semibold text-purple-700">💎 Langganan Premium</div>
                              <div className="text-xs text-purple-500">30 Hari Akses Penuh</div>
                            </>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-semibold text-gray-800">
                            Rp {payment.jumlah.toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            {statusBadge}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-700">
                            {new Date(payment.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(payment.createdAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {payment.paid_at && (
                            <div className="text-xs text-green-600 mt-1">
                              Paid: {new Date(payment.paid_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {payments.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                Total Transaksi: {payments.length}
              </span>
              <span className="text-blue-800 font-bold">
                Total Revenue (Paid): Rp {payments
                  .filter(p => p.status === 'paid')
                  .reduce((sum, p) => sum + p.jumlah, 0)
                  .toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

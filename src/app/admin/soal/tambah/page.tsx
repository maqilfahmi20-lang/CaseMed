import { requireAdmin } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import Link from 'next/link';
import TambahSoalForm from './form';

export default async function TambahSoalPage() {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h1 className="text-xl font-bold">Admin Panel</h1>
                  <p className="text-sm text-gray-300">Tambah Soal Baru</p>
                </div>
              </Link>
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

      <TambahSoalForm />
    </div>
  );
}

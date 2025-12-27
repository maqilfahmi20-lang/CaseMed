import { requireAdmin } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditSoalForm from './form';

export default async function EditSoalPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  
  const soal = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!soal) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin/soal" className="flex items-center gap-3 hover:opacity-80 transition">
              <span className="text-2xl">⚙️</span>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-gray-300">Edit Soal</p>
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

      <EditSoalForm soal={soal} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPackage } from '@/app/actions/admin/paket';
import Link from 'next/link';
import { KATEGORI_UKMPPD } from '@/lib/constants';

export default function TambahPaketForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [tipePaket, setTipePaket] = useState('latihan');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createPackage(formData);
      
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Redirect ke halaman edit untuk assign soal
      router.push(`/admin/paket/edit/${result.id}`);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/admin/paket"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Kembali ke Daftar Paket
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Paket Baru</h2>

            {/* Nama Paket */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Paket <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Contoh: Latihan Matematika Dasar"
                required
                disabled={isLoading}
              />
            </div>

            {/* Tipe Paket */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Paket <span className="text-red-500">*</span>
              </label>
              <select
                name="tipe_paket"
                value={tipePaket}
                onChange={(e) => setTipePaket(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                disabled={isLoading}
              >
                <option value="latihan">Latihan UKMPPD</option>
                <option value="simulasi">Simulasi UKMPPD</option>
              </select>
            </div>

            {/* Kategori (for both Latihan and Simulasi) */}
            {(tipePaket === 'latihan' || tipePaket === 'simulasi') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Sistem <span className="text-red-500">*</span>
                </label>
                <select
                  name="kategori"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                  disabled={isLoading}
                >
                  <option value="">Pilih Kategori</option>
                  {KATEGORI_UKMPPD.map((kat, index) => (
                    <option key={index} value={kat}>{kat}</option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">16 kategori sistem UKMPPD</p>
              </div>
            )}

            {/* Total Soal & Max Attempt */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Soal <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="total_soal"
                  min="1"
                  defaultValue="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Percobaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="max_attempt"
                  min="1"
                  defaultValue="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status Gratis */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_free"
                  value="true"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-gray-700">Paket Gratis</span>
              </label>
            </div>

            {/* Harga (jika berbayar) */}
            {!isFree && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="harga"
                  min="0"
                  defaultValue="50000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required={!isFree}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Status Aktif */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  value="true"
                  defaultChecked
                  className="w-5 h-5 text-blue-600"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-gray-700">Aktifkan Paket</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-8">
                Paket aktif akan ditampilkan ke user
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan & Assign Soal'}
              </button>
              <Link
                href="/admin/paket"
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

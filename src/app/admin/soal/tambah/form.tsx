'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuestion } from '@/app/actions/admin/soal';

export default function TambahSoalForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createQuestion(formData);
      
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setSuccess('Soal berhasil ditambahkan!');
      
      setTimeout(() => {
        router.push('/admin/soal');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Soal Baru</h2>

          {/* Kategori & Jenis Soal */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="kategori"
                id="kategori"
                onChange={(e) => {
                  const jenisSelect = document.getElementById('jenis_soal') as HTMLSelectElement;
                  if (jenisSelect) {
                    jenisSelect.disabled = e.target.value === 'ukmppd';
                    if (e.target.value === 'ukmppd') jenisSelect.value = '';
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                disabled={isLoading}
              >
                <option value="latihan">Latihan</option>
                <option value="ukmppd">UKMPPD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Soal <span className="text-gray-500">(khusus latihan)</span>
              </label>
              <select
                name="jenis_soal"
                id="jenis_soal"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              >
                <option value="">-- Pilih Jenis --</option>
                <option value="matematika">Matematika</option>
                <option value="fisika">Fisika</option>
                <option value="kimia">Kimia</option>
                <option value="bahasa_indonesia">Bahasa Indonesia</option>
                <option value="bahasa_inggris">Bahasa Inggris</option>
              </select>
            </div>
          </div>

          {/* Pertanyaan */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pertanyaan <span className="text-red-500">*</span>
            </label>
            <textarea
              name="pertanyaan"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Masukkan pertanyaan soal..."
              required
              disabled={isLoading}
            />
          </div>

          {/* Opsi Jawaban */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opsi Jawaban <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {['A', 'B', 'C', 'D', 'E'].map((label, index) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-gray-700 font-semibold w-8">{label}.</span>
                  <input
                    type="text"
                    name={`opsi_${label.toLowerCase()}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder={`Opsi ${label}`}
                    required
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Jawaban Benar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jawaban Benar <span className="text-red-500">*</span>
            </label>
            <select
              name="jawaban_benar"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            >
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
              <option value="e">E</option>
            </select>
          </div>

          {/* Pembahasan */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pembahasan
            </label>
            <textarea
              name="pembahasan"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Masukkan pembahasan soal (opsional)..."
              disabled={isLoading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Soal'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePackage, assignQuestionsToPackage } from '@/app/actions/admin/paket';
import Link from 'next/link';

interface Question {
  id: string;
  kategori: string;
  jenis_soal: string | null;
  pertanyaan: string;
}

interface PackageQuestion {
  question: Question;
}

interface Package {
  id: string;
  nama: string;
  tipe_paket: string;
  total_soal: number;
  max_attempt: number;
  is_free: boolean;
  harga: number | null;
  is_active: boolean;
  questions: PackageQuestion[];
}

export default function EditPaketForm({ 
  paket, 
  allQuestions 
}: { 
  paket: Package;
  allQuestions: Question[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFree, setIsFree] = useState(paket.is_free);
  
  // Filter & search state
  const [filterKategori, setFilterKategori] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected questions
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(
    paket.questions.map(pq => pq.question.id)
  );

  const handleUpdatePackage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await updatePackage(paket.id, formData);
      
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setSuccess('Paket berhasil diupdate!');
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  const handleAssignQuestions = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await assignQuestionsToPackage(paket.id, selectedQuestions);
      
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setSuccess('Soal berhasil di-assign!');
      setIsLoading(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const selectAll = () => {
    const filtered = getFilteredQuestions();
    setSelectedQuestions(filtered.map(q => q.id));
  };

  const deselectAll = () => {
    setSelectedQuestions([]);
  };

  const getFilteredQuestions = () => {
    return allQuestions.filter(q => {
      const matchKategori = !filterKategori || q.kategori === filterKategori;
      const matchJenis = !filterJenis || q.jenis_soal === filterJenis;
      const matchSearch = !searchQuery || q.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase());
      return matchKategori && matchJenis && matchSearch;
    });
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
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

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form Edit Paket */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Paket</h2>

              <form onSubmit={handleUpdatePackage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Paket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    defaultValue={paket.nama}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Paket <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tipe_paket"
                    defaultValue={paket.tipe_paket}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                    disabled={isLoading}
                  >
                    <option value="latihan">Latihan</option>
                    <option value="ukmppd">UKMPPD</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Soal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="total_soal"
                      min="1"
                      defaultValue={paket.total_soal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                      defaultValue={paket.max_attempt}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_free"
                      value="true"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                      disabled={isLoading}
                    />
                    <span className="text-sm font-medium text-gray-700">Paket Gratis</span>
                  </label>
                </div>

                {!isFree && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="harga"
                      min="0"
                      defaultValue={paket.harga || 0}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required={!isFree}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      value="true"
                      defaultChecked={paket.is_active}
                      className="w-4 h-4 text-blue-600"
                      disabled={isLoading}
                    />
                    <span className="text-sm font-medium text-gray-700">Aktifkan Paket</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Menyimpan...' : 'Update Paket'}
                </button>
              </form>
            </div>

            {/* Assign Soal */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Assign Soal</h2>
                <span className="text-sm text-gray-600">
                  {selectedQuestions.length} / {paket.total_soal} soal dipilih
                </span>
              </div>

              {/* Filters */}
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={filterKategori}
                    onChange={(e) => setFilterKategori(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Semua Kategori</option>
                    <option value="latihan">Latihan</option>
                    <option value="ukmppd">UKMPPD</option>
                  </select>

                  <select
                    value={filterJenis}
                    onChange={(e) => setFilterJenis(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Semua Jenis</option>
                    <option value="matematika">Matematika</option>
                    <option value="fisika">Fisika</option>
                    <option value="kimia">Kimia</option>
                    <option value="bahasa_indonesia">Bahasa Indonesia</option>
                    <option value="bahasa_inggris">Bahasa Inggris</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />

                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="flex-1 text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    Pilih Semua
                  </button>
                  <button
                    onClick={deselectAll}
                    className="flex-1 text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    Batal Semua
                  </button>
                </div>
              </div>

              {/* Question List */}
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                {filteredQuestions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>Tidak ada soal ditemukan</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredQuestions.map((question) => (
                      <label
                        key={question.id}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(question.id)}
                          onChange={() => toggleQuestion(question.id)}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="flex gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              question.kategori === 'ukmppd' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {question.kategori}
                            </span>
                            {question.jenis_soal && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                {question.jenis_soal.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {question.pertanyaan}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAssignQuestions}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Soal Terpilih'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

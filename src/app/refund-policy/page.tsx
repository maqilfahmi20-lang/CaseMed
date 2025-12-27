import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:opacity-80">
              CaseMed
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              ← Kembali
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Kebijakan Pengembalian Dana</h1>
          <p className="text-sm text-gray-500 mb-8">Terakhir diperbarui: 27 Desember 2025</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Ketentuan Umum</h2>
              <p className="leading-relaxed">
                Kami berkomitmen untuk memberikan layanan terbaik kepada pengguna. Kebijakan pengembalian dana 
                ini menjelaskan kondisi di mana pengembalian dana dapat diajukan dan diproses untuk pembelian 
                paket tryout online.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Kondisi Pengembalian Dana</h2>
              <p className="leading-relaxed mb-3">
                Anda dapat mengajukan pengembalian dana dalam kondisi berikut:
              </p>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ DAPAT Dikembalikan:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-green-700">
                    <li>Pembayaran ganda untuk paket yang sama (double charge)</li>
                    <li>Kesalahan teknis yang menyebabkan paket tidak dapat diakses dalam 48 jam</li>
                    <li>Paket yang dibeli tidak sesuai dengan deskripsi yang dijanjikan</li>
                    <li>Belum pernah mengerjakan ujian dari paket yang dibeli (0 percobaan)</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">❌ TIDAK DAPAT Dikembalikan:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-red-700">
                    <li>Sudah mulai mengerjakan ujian (minimal 1 percobaan)</li>
                    <li>Sudah melewati masa berlaku 7 hari setelah pembelian</li>
                    <li>Alasan pribadi seperti berubah pikiran atau tidak cocok dengan soal</li>
                    <li>Hasil nilai ujian yang tidak memuaskan</li>
                    <li>Kesalahan pengguna sendiri (lupa password, tidak bisa login, dll)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Batas Waktu Pengajuan</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>3.1 Masa Pengajuan:</strong> Permintaan pengembalian dana harus diajukan maksimal 
                  <strong className="text-blue-600"> 7 hari kalender</strong> sejak tanggal pembelian.
                </p>
                <p className="leading-relaxed">
                  <strong>3.2 Pengecualian:</strong> Untuk kesalahan teknis yang terbukti dari pihak kami, 
                  batas waktu dapat diperpanjang hingga 14 hari.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Cara Mengajukan Pengembalian Dana</h2>
              <div className="space-y-3">
                <p className="leading-relaxed mb-3">Untuk mengajukan pengembalian dana, ikuti langkah berikut:</p>
                
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="font-medium text-blue-900">Hubungi Tim Support</p>
                      <p className="text-sm text-blue-700">Email ke: support@sistemtryout.com atau WhatsApp: +62 812-3456-7890</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="font-medium text-blue-900">Sertakan Informasi Berikut:</p>
                      <ul className="text-sm text-blue-700 list-disc list-inside ml-2 mt-1">
                        <li>Nomor pesanan (Order ID)</li>
                        <li>Email akun terdaftar</li>
                        <li>Nama paket yang dibeli</li>
                        <li>Alasan pengembalian dana</li>
                        <li>Screenshot bukti pembayaran</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="font-medium text-blue-900">Tunggu Verifikasi</p>
                      <p className="text-sm text-blue-700">Tim kami akan memverifikasi dalam 1-3 hari kerja</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                    <div>
                      <p className="font-medium text-blue-900">Proses Pengembalian</p>
                      <p className="text-sm text-blue-700">Jika disetujui, dana akan dikembalikan dalam 7-14 hari kerja</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Proses Verifikasi</h2>
              <p className="leading-relaxed mb-3">
                Tim kami akan melakukan verifikasi untuk memastikan permintaan pengembalian dana memenuhi syarat:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Validasi bukti pembayaran</li>
                <li>Pengecekan riwayat penggunaan akun</li>
                <li>Verifikasi alasan pengembalian dana</li>
                <li>Konfirmasi bahwa paket belum digunakan (jika berlaku)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Metode Pengembalian Dana</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  Dana akan dikembalikan melalui metode yang sama dengan pembayaran awal:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Transfer Bank:</strong> 7-14 hari kerja</li>
                  <li><strong>E-Wallet (GoPay, OVO, Dana):</strong> 3-7 hari kerja</li>
                  <li><strong>Kartu Kredit/Debit:</strong> 14-30 hari kerja (tergantung bank)</li>
                </ul>
                <p className="text-sm text-gray-600 italic mt-3">
                  * Waktu pemrosesan dapat bervariasi tergantung pada institusi keuangan masing-masing
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Pembatalan Otomatis</h2>
              <p className="leading-relaxed">
                Jika terjadi kegagalan pembayaran atau pembayaran tidak terverifikasi dalam 24 jam, pesanan 
                akan otomatis dibatalkan dan tidak ada biaya yang akan dikenakan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Pengembalian Parsial</h2>
              <p className="leading-relaxed">
                Dalam kasus tertentu, kami dapat menawarkan pengembalian dana parsial atau kredit akun 
                sebagai alternatif, yang dapat digunakan untuk pembelian paket lain di platform kami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Kebijakan Khusus</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>9.1 Paket Gratis:</strong> Paket gratis tidak berlaku untuk pengembalian dana.
                </p>
                <p className="leading-relaxed">
                  <strong>9.2 Promosi dan Diskon:</strong> Paket yang dibeli dengan diskon atau promosi tetap 
                  dapat dikembalikan sesuai ketentuan, dengan jumlah pengembalian sesuai harga yang dibayarkan.
                </p>
                <p className="leading-relaxed">
                  <strong>9.3 Force Majeure:</strong> Dalam kondisi di luar kendali kami (bencana alam, 
                  gangguan server ekstrem, dll), kebijakan pengembalian dana dapat disesuaikan.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Hak Kami</h2>
              <p className="leading-relaxed mb-3">
                Kami berhak untuk:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Menolak permintaan pengembalian dana yang tidak memenuhi syarat</li>
                <li>Meminta informasi tambahan untuk verifikasi</li>
                <li>Menangguhkan atau menutup akun yang menyalahgunakan kebijakan ini</li>
                <li>Mengubah kebijakan ini dengan pemberitahuan sebelumnya</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Penyelesaian Sengketa</h2>
              <p className="leading-relaxed">
                Jika Anda tidak puas dengan keputusan pengembalian dana, Anda dapat mengajukan banding dalam 
                7 hari setelah keputusan. Keputusan akhir kami bersifat final dan mengikat.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Hubungi Kami</h2>
              <p className="leading-relaxed mb-3">
                Untuk pertanyaan tentang Kebijakan Pengembalian Dana atau untuk mengajukan pengembalian:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>Email:</strong> support@sistemtryout.com</p>
                <p><strong>WhatsApp:</strong> +62 812-3456-7890</p>
                <p><strong>Jam Operasional:</strong> Senin - Jumat, 09:00 - 17:00 WIB</p>
                <p className="text-sm text-gray-600 mt-2">
                  Kami akan merespons dalam 1x24 jam di hari kerja
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex gap-4">
              <Link 
                href="/terms" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Syarat dan Ketentuan
              </Link>
              <Link 
                href="/privacy-policy" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Kebijakan Privasi →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

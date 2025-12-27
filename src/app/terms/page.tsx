import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Syarat dan Ketentuan</h1>
          <p className="text-sm text-gray-500 mb-8">Terakhir diperbarui: 27 Desember 2025</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Penerimaan Syarat</h2>
              <p className="leading-relaxed">
                Dengan mengakses dan menggunakan platform CaseMed ("Platform"), Anda menyetujui 
                untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat dan ketentuan 
                ini, mohon untuk tidak menggunakan Platform kami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Layanan Platform</h2>
              <p className="leading-relaxed mb-3">
                Platform kami menyediakan layanan tryout online untuk persiapan ujian, termasuk namun tidak terbatas pada:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Paket soal latihan dan ujian berbagai mata pelajaran</li>
                <li>Paket tryout UKMPPD (Uji Kompetensi Mahasiswa Program Profesi Dokter)</li>
                <li>Sistem penilaian otomatis dan pembahasan soal</li>
                <li>Riwayat percobaan dan analisis hasil ujian</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Akun Pengguna</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>3.1 Pendaftaran:</strong> Anda harus mendaftar dan membuat akun untuk mengakses layanan kami. 
                  Informasi yang Anda berikan harus akurat dan terkini.
                </p>
                <p className="leading-relaxed">
                  <strong>3.2 Keamanan:</strong> Anda bertanggung jawab untuk menjaga kerahasiaan password dan akun Anda. 
                  Segera laporkan kepada kami jika terjadi penggunaan akun yang tidak sah.
                </p>
                <p className="leading-relaxed">
                  <strong>3.3 Penggunaan yang Sah:</strong> Akun Anda bersifat pribadi dan tidak boleh dibagikan kepada pihak lain.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Pembelian dan Pembayaran</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>4.1 Paket Berbayar:</strong> Beberapa paket tryout kami memerlukan pembayaran. Harga akan 
                  ditampilkan dengan jelas dalam Rupiah (IDR) sebelum pembelian.
                </p>
                <p className="leading-relaxed">
                  <strong>4.2 Metode Pembayaran:</strong> Kami menerima berbagai metode pembayaran melalui gateway 
                  pembayaran Midtrans yang aman dan terpercaya.
                </p>
                <p className="leading-relaxed">
                  <strong>4.3 Konfirmasi:</strong> Setelah pembayaran berhasil, Anda akan mendapatkan akses langsung 
                  ke paket yang dibeli sesuai dengan batas percobaan yang ditentukan.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Penggunaan Platform</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">Anda setuju untuk TIDAK:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Menyalin, memodifikasi, atau mendistribusikan konten soal tanpa izin</li>
                  <li>Menggunakan Platform untuk tujuan ilegal atau melanggar hukum</li>
                  <li>Mengganggu atau merusak server dan jaringan Platform</li>
                  <li>Membagikan akun atau hasil ujian kepada pihak lain</li>
                  <li>Menggunakan bot atau otomasi untuk mengakses Platform</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Hak Kekayaan Intelektual</h2>
              <p className="leading-relaxed">
                Seluruh konten Platform termasuk soal, pembahasan, desain, logo, dan materi lainnya adalah 
                milik kami atau pemberi lisensi kami dan dilindungi oleh hak cipta. Anda tidak diperkenankan 
                untuk menggunakan konten tersebut tanpa izin tertulis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Batasan Percobaan</h2>
              <p className="leading-relaxed">
                Setiap paket tryout memiliki batas maksimal percobaan yang telah ditentukan. Setelah batas 
                tercapai, Anda tidak dapat lagi mengerjakan paket tersebut kecuali melakukan pembelian ulang 
                atau upgrade paket.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Penolakan Jaminan</h2>
              <p className="leading-relaxed">
                Platform disediakan "sebagaimana adanya". Kami tidak menjamin bahwa Platform akan selalu 
                tersedia, bebas dari kesalahan, atau aman dari virus. Hasil tryout yang diperoleh tidak 
                menjamin kelulusan ujian resmi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Pembatasan Tanggung Jawab</h2>
              <p className="leading-relaxed">
                Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau 
                konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Perubahan Layanan</h2>
              <p className="leading-relaxed">
                Kami berhak untuk memodifikasi, menangguhkan, atau menghentikan layanan Platform kapan saja 
                tanpa pemberitahuan sebelumnya.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Perubahan Syarat dan Ketentuan</h2>
              <p className="leading-relaxed">
                Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu. Perubahan akan 
                ditampilkan di halaman ini dengan tanggal "Terakhir diperbarui". Penggunaan Platform 
                setelah perubahan berarti Anda menerima syarat yang diperbarui.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Hukum yang Berlaku</h2>
              <p className="leading-relaxed">
                Syarat dan ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia. 
                Setiap perselisihan akan diselesaikan melalui pengadilan yang berwenang di Indonesia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">13. Hubungi Kami</h2>
              <p className="leading-relaxed mb-3">
                Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>Email:</strong> support@sistemtryout.com</p>
                <p><strong>WhatsApp:</strong> +62 812-3456-7890</p>
                <p><strong>Alamat:</strong> Jakarta, Indonesia</p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex gap-4">
              <Link 
                href="/refund-policy" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Kebijakan Pengembalian Dana →
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

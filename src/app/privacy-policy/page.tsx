import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Kebijakan Privasi</h1>
          <p className="text-sm text-gray-500 mb-8">Terakhir diperbarui: 27 Desember 2025</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <p className="leading-relaxed mb-4">
                CaseMed ("kami", "Platform") berkomitmen untuk melindungi privasi pengguna. 
                Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi 
                informasi pribadi Anda saat menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Informasi yang Kami Kumpulkan</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">1.1 Informasi yang Anda Berikan</h3>
                  <p className="leading-relaxed mb-2">Saat mendaftar dan menggunakan layanan, kami mengumpulkan:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Data Akun:</strong> Nama lengkap, email, password (terenkripsi)</li>
                    <li><strong>Data Pembayaran:</strong> Informasi transaksi (diproses oleh Midtrans)</li>
                    <li><strong>Data Ujian:</strong> Jawaban, nilai, waktu pengerjaan, riwayat percobaan</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">1.2 Informasi yang Dikumpulkan Otomatis</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Data Teknis:</strong> Alamat IP, tipe browser, sistem operasi</li>
                    <li><strong>Data Penggunaan:</strong> Halaman yang dikunjungi, durasi sesi, aktivitas Platform</li>
                    <li><strong>Cookies:</strong> Data untuk autentikasi dan preferensi pengguna</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Cara Kami Menggunakan Informasi</h2>
              <p className="leading-relaxed mb-3">Informasi yang dikumpulkan digunakan untuk:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Menyediakan Layanan:</strong> Memproses pendaftaran, mengelola akun, memberikan akses tryout</li>
                <li><strong>Pemrosesan Pembayaran:</strong> Memverifikasi dan memproses transaksi pembayaran</li>
                <li><strong>Analisis Kinerja:</strong> Menyimpan dan menampilkan hasil ujian, riwayat percobaan</li>
                <li><strong>Komunikasi:</strong> Mengirim notifikasi penting, update layanan, respons support</li>
                <li><strong>Keamanan:</strong> Mencegah penyalahgunaan, fraud, dan aktivitas ilegal</li>
                <li><strong>Peningkatan Layanan:</strong> Menganalisis penggunaan untuk meningkatkan Platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Pembagian Informasi</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  Kami <strong>TIDAK</strong> menjual, menyewakan, atau memperdagangkan informasi pribadi Anda 
                  kepada pihak ketiga. Kami hanya membagikan informasi dalam kondisi berikut:
                </p>
                
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Penyedia Layanan Payment Gateway</h4>
                    <p className="text-sm text-blue-800">
                      Informasi pembayaran diproses oleh <strong>Midtrans</strong> (payment gateway resmi) 
                      untuk memfasilitasi transaksi yang aman. Midtrans memiliki kebijakan privasi sendiri.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Kewajiban Hukum</h4>
                    <p className="text-sm text-blue-800">
                      Kami dapat membagikan informasi jika diwajibkan oleh hukum, perintah pengadilan, 
                      atau permintaan pemerintah yang sah.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Perlindungan Hak</h4>
                    <p className="text-sm text-blue-800">
                      Untuk melindungi hak, properti, atau keamanan Platform, pengguna, atau publik.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Keamanan Data</h2>
              <p className="leading-relaxed mb-3">
                Kami menerapkan langkah-langkah keamanan untuk melindungi informasi Anda:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Enkripsi Data:</strong> Password dan data sensitif dienkripsi menggunakan bcrypt</li>
                <li><strong>HTTPS/SSL:</strong> Koneksi aman untuk semua komunikasi data</li>
                <li><strong>Token Autentikasi:</strong> JWT (JSON Web Token) untuk sesi pengguna yang aman</li>
                <li><strong>Pembatasan Akses:</strong> Hanya personel yang berwenang dapat mengakses data</li>
                <li><strong>Monitoring:</strong> Pemantauan aktivitas mencurigakan dan upaya akses ilegal</li>
              </ul>
              <p className="text-sm text-gray-600 italic mt-3">
                Meskipun kami berupaya maksimal, tidak ada sistem yang 100% aman dari ancaman cyber.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Cookies dan Teknologi Pelacakan</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  Kami menggunakan cookies untuk meningkatkan pengalaman pengguna:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Cookies Esensial:</strong> Diperlukan untuk autentikasi dan fungsi dasar Platform</li>
                  <li><strong>Cookies Preferensi:</strong> Menyimpan pilihan bahasa dan setting pengguna</li>
                  <li><strong>Cookies Analitik:</strong> Membantu kami memahami cara pengguna menggunakan Platform</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  Anda dapat mengatur browser untuk menolak cookies, namun beberapa fitur Platform mungkin tidak berfungsi.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Hak Pengguna</h2>
              <p className="leading-relaxed mb-3">Anda memiliki hak untuk:</p>
              <div className="bg-green-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <strong className="text-green-900">Mengakses Data:</strong>
                    <span className="text-green-800"> Meminta salinan data pribadi yang kami simpan</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <strong className="text-green-900">Memperbaiki Data:</strong>
                    <span className="text-green-800"> Memperbarui informasi yang tidak akurat</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <strong className="text-green-900">Menghapus Data:</strong>
                    <span className="text-green-800"> Meminta penghapusan akun dan data terkait</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <strong className="text-green-900">Membatasi Pemrosesan:</strong>
                    <span className="text-green-800"> Meminta pembatasan penggunaan data tertentu</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <strong className="text-green-900">Portabilitas Data:</strong>
                    <span className="text-green-800"> Meminta data dalam format yang dapat dipindahkan</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Untuk menggunakan hak-hak ini, hubungi kami di: support@sistemtryout.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Penyimpanan Data</h2>
              <p className="leading-relaxed">
                Kami menyimpan informasi pribadi Anda selama akun aktif atau sepanjang diperlukan untuk 
                menyediakan layanan. Data dapat disimpan lebih lama jika diperlukan untuk memenuhi kewajiban 
                hukum, menyelesaikan sengketa, atau menegakkan perjanjian.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Privasi Anak-anak</h2>
              <p className="leading-relaxed">
                Platform kami terbuka untuk pengguna berusia 13 tahun ke atas. Kami tidak secara sengaja 
                mengumpulkan informasi dari anak-anak di bawah 13 tahun. Jika Anda adalah orang tua dan 
                mengetahui anak Anda memberikan informasi kepada kami, silakan hubungi kami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Link ke Situs Pihak Ketiga</h2>
              <p className="leading-relaxed">
                Platform kami mungkin berisi link ke situs web pihak ketiga. Kami tidak bertanggung jawab 
                atas praktik privasi situs tersebut. Kami mendorong Anda untuk membaca kebijakan privasi 
                setiap situs yang Anda kunjungi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Transfer Data Internasional</h2>
              <p className="leading-relaxed">
                Data Anda disimpan di server yang berlokasi di Indonesia. Jika Anda mengakses Platform dari 
                luar Indonesia, transfer data Anda akan tunduk pada hukum Indonesia dan kebijakan privasi ini.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Perubahan Kebijakan Privasi</h2>
              <p className="leading-relaxed">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan ditampilkan 
                di halaman ini dengan tanggal "Terakhir diperbarui" yang baru. Perubahan signifikan akan 
                dikomunikasikan melalui email atau notifikasi di Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Persetujuan</h2>
              <p className="leading-relaxed">
                Dengan menggunakan Platform kami, Anda menyetujui pengumpulan dan penggunaan informasi 
                sesuai dengan Kebijakan Privasi ini.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">13. Hubungi Kami</h2>
              <p className="leading-relaxed mb-3">
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak privasi Anda:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>Email:</strong> privacy@sistemtryout.com atau support@sistemtryout.com</p>
                <p><strong>WhatsApp:</strong> +62 812-3456-7890</p>
                <p><strong>Alamat:</strong> Jakarta, Indonesia</p>
                <p className="text-sm text-gray-600 mt-2">
                  Kami akan merespons permintaan Anda dalam 14 hari kerja
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
                Syarat dan Ketentuan
              </Link>
              <Link 
                href="/refund-policy" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Kebijakan Pengembalian Dana
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

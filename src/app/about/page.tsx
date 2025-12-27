import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
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
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Tentang Kami
            </h1>
            <p className="text-xl text-gray-600">
              Platform Tryout Online Terpercaya untuk Persiapan Ujian Anda
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white mb-12">
            <h2 className="text-3xl font-bold mb-4">Misi Kami</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Menyediakan platform tryout online yang berkualitas, terjangkau, dan mudah diakses 
              untuk membantu siswa dan mahasiswa mencapai hasil terbaik dalam ujian mereka.
            </p>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cerita Kami</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>CaseMed</strong> lahir dari pengalaman pribadi kami sebagai 
                mahasiswa yang memahami betapa pentingnya persiapan yang matang untuk menghadapi 
                ujian-ujian penting seperti UKMPPD, ujian masuk perguruan tinggi, dan tes kompetensi lainnya.
              </p>
              <p>
                Kami melihat bahwa banyak siswa dan mahasiswa yang kesulitan mengakses materi tryout 
                berkualitas dengan harga terjangkau. Bimbingan belajar offline sering kali mahal dan 
                tidak fleksibel dengan jadwal belajar yang padat.
              </p>
              <p>
                Dengan latar belakang teknologi dan pendidikan, kami mengembangkan platform ini untuk 
                memberikan solusi yang dapat diakses kapan saja, di mana saja, dengan harga yang jauh 
                lebih terjangkau dibandingkan bimbel konvensional.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Bank Soal Lengkap</h3>
              <p className="text-gray-600 text-sm">
                Ribuan soal berkualitas dengan pembahasan detail untuk berbagai jenis ujian dan 
                mata pelajaran.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Sistem Real-Time</h3>
              <p className="text-gray-600 text-sm">
                Penilaian otomatis dan instan dengan timer yang akurat seperti ujian sesungguhnya.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Analisis Mendalam</h3>
              <p className="text-gray-600 text-sm">
                Riwayat percobaan lengkap dengan analisis nilai untuk membantu Anda memperbaiki 
                kelemahan.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Harga Terjangkau</h3>
              <p className="text-gray-600 text-sm">
                Paket tryout dengan harga yang jauh lebih ekonomis dibandingkan bimbel offline 
                dengan kualitas setara.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Aman & Terpercaya</h3>
              <p className="text-gray-600 text-sm">
                Sistem keamanan data tingkat enterprise dengan enkripsi dan pembayaran melalui 
                Midtrans yang tersertifikasi.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Fokus Hasil</h3>
              <p className="text-gray-600 text-sm">
                Materi dan soal disusun oleh praktisi dan ahli di bidangnya untuk memaksimalkan 
                persiapan ujian Anda.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Pencapaian Kami</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-sm text-gray-600">Pengguna Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">5000+</div>
                <div className="text-sm text-gray-600">Soal Berkualitas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Paket Tryout</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
                <div className="text-sm text-gray-600">Kepuasan User</div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nilai-Nilai Kami</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Kualitas</h3>
                  <p className="text-gray-600 text-sm">
                    Kami tidak pernah berkompromi dengan kualitas. Setiap soal dan materi melalui 
                    proses kurasi ketat oleh tim ahli kami.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤝</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Integritas</h3>
                  <p className="text-gray-600 text-sm">
                    Kami berkomitmen untuk transparan dan jujur dalam setiap aspek layanan kami, 
                    dari harga hingga konten materi.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Inovasi</h3>
                  <p className="text-gray-600 text-sm">
                    Kami terus berinovasi menggunakan teknologi terkini untuk memberikan pengalaman 
                    belajar yang lebih baik.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💙</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Dukungan</h3>
                  <p className="text-gray-600 text-sm">
                    Tim support kami siap membantu Anda kapan pun Anda membutuhkan, karena kesuksesan 
                    Anda adalah prioritas kami.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Siap Memulai Perjalanan Anda?</h2>
            <p className="text-green-100 mb-6 text-lg">
              Bergabunglah dengan ribuan siswa dan mahasiswa yang sudah mempercayai kami untuk 
              persiapan ujian mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-green-50 transition text-lg"
              >
                Daftar Sekarang →
              </Link>
              <Link 
                href="/contact" 
                className="bg-green-400 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-300 transition text-lg"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-600 mb-3">Informasi Lebih Lanjut:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Kontak
              </Link>
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Syarat & Ketentuan
              </Link>
              <Link href="/refund-policy" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Kebijakan Pengembalian Dana
              </Link>
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
